import datetime
import json
import jwt
import logging
import posixpath
import random
import os
import string
import time
import urllib
import urllib2

from google.appengine.ext import ndb

import config
import models


CLOCK_SKEW_SECS = 300  # 5 minutes in seconds
AUTH_TOKEN_LIFETIME_SECS = 300  # 5 minutes in seconds
MAX_TOKEN_LIFETIME_SECS = 86400 # 1 day in seconds


AUTH_TOKEN_HEADER = 'X-IdeaReminder-Auth-Token-ID'
LINK_CODE_HEADER = 'X-IdeaReminder-LinkCode'


class AuthError(Exception):
  """Error to indicate failure."""


# Link-based authentication for unsubscribing.

def generate_link(account, path):
  link_code = _generate_link_code()
  expiration = datetime.datetime.now() + datetime.timedelta(days=7)
  models.Link(parent=account.key, expiration=expiration, link_code=link_code).put()
  query_string = urllib.urlencode({
    'linkCode': link_code
  })
  full_path = posixpath.join(config.URL, path)
  return 'https://%s?%s' % (full_path, query_string)


def _generate_link_code(size=50, chars=string.ascii_lowercase + string.digits):
  """Generates a random link code."""
  # TODO(meh): Ensure that a link with this code doesn't already exist in NDB.
  return ''.join(random.choice(chars) for _ in range(size))

def require_link(func):

  def wrapper(self):
    # Ensure the link code is valid.
    link_code = self.request.headers.get(LINK_CODE_HEADER)
    link = models.Link.query(models.Link.link_code == link_code).get()
    logging.info(link_code)
    logging.info(link)
    if link is None or link.expiration < datetime.datetime.now():
      self.abort_clean('This link has expired.')

    account = link.key.parent().get()

    func(self, account)

  return wrapper


# Full Google-account-based authentication.

def require_token(func):

  def wrapper(self):
    token = self.request.headers.get(AUTH_TOKEN_HEADER)

    try:
      token_info = _validate_token(token)
    except Exception as e:
      logging.exception(e)
      # Invalid token
      # self.abort_clean('Bad credentials.')
      self.abort_clean(str(e))

    return func(self, token_info)

  return wrapper


def require_account(func):

  @require_token
  def wrapper(self, token_info):
    account = ndb.Key(models.Account, token_info.get('sub')).get()
    if account is None:
      self.abort_clean('No account.')
    func(self, account)

  return wrapper

def _validate_token(token):
  # Skip during unit tests.
  if 'ACCOUNT_ID_OVERRIDE' in os.environ:
    return {'sub': os.environ['ACCOUNT_ID_OVERRIDE']}

  url = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={}'.format(token)                
  response = urllib2.urlopen(url=url, timeout=30)
  idinfo = json.loads(response.read())
  if idinfo.get('aud') != config.CLIENT_ID:
    raise AuthError(
        'Token "aud" field does not match client id: {0}'.format(idinfo))
  if idinfo.get('iss') not in ['accounts.google.com', 'https://accounts.google.com']:
    raise AuthError('Wrong issuer.')
  _verify_time_range(idinfo)
  return idinfo


def _verify_time_range(payload_dict):
    """Verifies the issued at and expiration from a JWT payload.

    Makes sure the current time (in UTC) falls between the issued at and
    expiration for the JWT (with some skew allowed for via
    ``CLOCK_SKEW_SECS``).

    Args:
        payload_dict: dict, A dictionary containing a JWT payload.

    Raises:
        AuthError: If there is no ``'iat'`` field in the payload
                          dictionary.
        AuthError: If there is no ``'exp'`` field in the payload
                          dictionary.
        AuthError: If the JWT expiration is too far in the future (i.e.
                          if the expiration would imply a token lifetime
                          longer than what is allowed.)
        AuthError: If the token appears to have been issued in the
                          future (up to clock skew).
        AuthError: If the token appears to have expired in the past
                          (up to clock skew).
    """
    # Get the current time to use throughout.
    now = int(time.time())

    # Make sure issued at and expiration are in the payload.
    issued_at = payload_dict.get('iat')
    if issued_at is None:
        raise AuthError(
            'No iat field in token: {0}'.format(payload_dict))
    expiration = payload_dict.get('exp')
    if expiration is None:
        raise AuthError(
            'No exp field in token: {0}'.format(payload_dict))

    issued_at = int(issued_at)
    expiration = int(expiration)

    # Make sure the expiration gives an acceptable token lifetime.
    if expiration >= now + MAX_TOKEN_LIFETIME_SECS:
        raise AuthError(
            'exp field too far in future: {0}'.format(payload_dict))

    # Make sure (up to clock skew) that the token wasn't issued in the future.
    earliest = issued_at - CLOCK_SKEW_SECS
    if now < earliest:
        raise AuthError('Token used too early, {0} < {1}: {2}'.format(
            now, earliest, payload_dict))
    # Make sure (up to clock skew) that the token isn't already expired.
    latest = expiration + CLOCK_SKEW_SECS
    if now > latest:
        raise AuthError('Token used too late, {0} > {1}: {2}'.format(
            now, latest, payload_dict))
