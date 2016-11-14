import datetime
import json
import logging
import posixpath
import random
import string
import webapp2

from validate_email import validate_email

from google.appengine.ext import ndb

import config
import mail
import models


class CleanException(webapp2.HTTPException):
  def __init__(self, message, email):
    self.code = 400
    self.message = message
    self.email = email


class BaseHandler(webapp2.RequestHandler):

  def handle_exception(self, exception, debug):
    logging.exception(exception)

    try:
      if isinstance(exception, webapp2.HTTPException):
        self.response.set_status(exception.code)
        result = {'message': exception.message}
        if isinstance(exception, CleanException):
          if exception.email is not None:
            # Include the email address in case it's useful.
            result['email'] = exception.email
        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps(result))
        return
    except:
      pass

    self.response.set_status(500)

  def abort_clean(self, message, email=None):
    raise CleanException(message, email)


class Users(BaseHandler):
  """RESTful endpoints for creating and updating users."""

  def post(self):
    """Creates a user."""
    body = json.loads(self.request.body)
    email = body.get('email')

    if email is None or email == '':
      self.abort_clean('Please provide an email address.')

    if not validate_email(email):
      self.abort_clean('The email address "%s" is invalid.' % email)

    if models.User.query(models.User.email == email).get():
      self.abort_clean('The email address "%s" is already subscribed.' % email)

    user = models.User(email=email)
    user.put()

    link_code = id_generator()
    expiration = datetime.datetime.now() + datetime.timedelta(days=7)
    models.Link(parent=user.key, expiration=expiration, link_code=link_code).put()
    link = posixpath.join(config.URL, 'verify/%s/%s' % (user.key.urlsafe(), link_code))

    mail.send_email_from_template(email, 'welcome', {'verification_link': link})

  def patch(self, user_id):
    """Applies the patch in the request body to the user with the id."""
    user_key = ndb.Key(urlsafe=user_id)
    user = user_key.get()
    if user is None:
      self.abort_clean('Invalid user ID.')

    link_code = self.request.headers.get('X-IdeaReminder-LinkCode')
    user_links = models.Link.query(ancestor=user_key)
    link = user_links.filter(models.Link.link_code == link_code).get()
    if link is None or link.expiration < datetime.datetime.now():
      self.abort_clean('This link has expired.', user.email)

    body = json.loads(self.request.body)

    if 'isVerified' in body:
      if body.get('isVerified'):
        if user.is_verified:
          self.abort_clean(
              'The subscription for "%s" has already been verified.' % user.email)
        else:
          user.is_verified = True

    user.put()

    self.response.write(json.dumps(user.to_dict()))
    self.response.headers['Content-Type'] = 'application/json'


class Ideas(BaseHandler):
  """RESTful endpoint for listing ideas."""

  def get(self):
    pass


def id_generator(size=50, chars=string.ascii_lowercase + string.digits):
  return ''.join(random.choice(chars) for _ in range(size))


# Add PATCH support to webapp2.
allowed_methods = webapp2.WSGIApplication.allowed_methods
new_allowed_methods = allowed_methods.union(('PATCH',))
webapp2.WSGIApplication.allowed_methods = new_allowed_methods


app = webapp2.WSGIApplication([
  webapp2.Route(r'/api/users/<user_id:[^/]*>/ideas', Ideas),
  webapp2.Route(r'/api/users/<user_id:[^/]*>', Users),
  webapp2.Route(r'/api/users', Users),
], debug=True)