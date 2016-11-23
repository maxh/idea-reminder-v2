import datetime
from oauth2client import client, crypt
import json
import posixpath
import random
import string
import urllib

from google.appengine.ext import ndb

import config
import models


AUTH_TOKEN_HEADER = 'X-Google-Auth-Token-ID'
LINK_CODE_HEADER = 'X-IdeaReminder-LinkCode'


def require_token(func):

  def wrapper(self):
    token = self.request.headers.get(AUTH_TOKEN_HEADER)

    try:
      token_info = client.verify_id_token(token, config.CLIENT_ID)
      if token_info['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
        raise crypt.AppIdentityError('Wrong issuer.')
    except Exception:
      # Invalid token
      self.abort_clean('Bad credentials.')

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