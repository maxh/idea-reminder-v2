import datetime
import posixpath
import random
import string

from google.appengine.ext import ndb

import config
import models


def generate_link(user, path):
  link_code = generate_link_code()
  expiration = datetime.datetime.now() + datetime.timedelta(days=7)
  models.Link(parent=user.key, expiration=expiration, link_code=link_code).put()
  full_path = '%s/%s/%s' % (path, user.key.urlsafe(), link_code)
  return posixpath.join(config.URL, full_path)


def generate_link_code(size=50, chars=string.ascii_lowercase + string.digits):
  """Generates a random link code."""
  # TODO(meh): Ensure that a link with this code doesn't already exist in NDB.
  return ''.join(random.choice(chars) for _ in range(size))


def request_validator(func):
  """A decorator for request validation based on user ID and link code."""

  def wrapper(self, user_id):
    # Ensure the user ID is known.
    user = None
    try:
      user_key = ndb.Key(urlsafe=user_id)
      user = user_key.get()
    except:
      pass

    if user is None:
      self.abort_clean('Unknown user ID.')

    # Ensure the link code is valid.
    link_code = self.request.headers.get('X-IdeaReminder-LinkCode')
    user_links = models.Link.query(ancestor=user_key)
    link = user_links.filter(models.Link.link_code == link_code).get()
    if link is None or link.expiration < datetime.datetime.now():
      self.abort_clean('This link has expired.', user.email)

    return func(self, user)

  return wrapper