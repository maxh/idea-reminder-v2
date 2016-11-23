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


AUTH_HEADER = 'X-Google-Auth-Token-ID';


def require_token(func):

  def wrapper(self):
    token = self.request.headers.get(AUTH_HEADER)

    try:
      token_info = client.verify_id_token(token, config.CLIENT_ID)
      if token_info['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
        raise crypt.AppIdentityError('Wrong issuer.')
    except:
      # Invalid token
      self.abort_clean('Bad credentials.')

    return func(self, token_info)

  return wrapper


def require_user(func):

  @require_token
  def wrapper(self, token_info):
    user = ndb.Key(models.User, token_info.get('sub')).get()
    if user is None:
      self.abort_clean('No user.')
    func(self, user)

  return wrapper