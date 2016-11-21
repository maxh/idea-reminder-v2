import datetime
import json
import logging
import posixpath
import webapp2

from validate_email import validate_email

import auth
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

    result = None
    try:
      if isinstance(exception, webapp2.HTTPException):
        self.response.set_status(exception.code)
        result = {'message': exception.message}
        if isinstance(exception, CleanException):
          if exception.email is not None:
            # Include the email address in case it's useful.
            result['email'] = exception.email
    except:
      pass

    if result is None:
      result = {'message': 'Unknown server error.'}
      self.response.set_status(500)

    self.response.write(json.dumps(result))
    self.response.headers['Content-Type'] = 'application/json'

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

    email = email.lower()

    if models.User.query(models.User.email == email).get():
      self.abort_clean('The email address "%s" is already subscribed.' % email)

    user = models.User(email=email)
    user.put()

    mail.send_email_from_template(email, 'welcome', {
      'verification_link': auth.generate_link(user, 'verify')
    })

    self.response.write(json.dumps(user.to_dict()))
    self.response.headers['Content-Type'] = 'application/json'


  @auth.request_validator
  def patch(self, user):
    """Applies the patch in the request body to the user with the id."""
    body = json.loads(self.request.body)

    if 'isVerified' in body:
      if body.get('isVerified'):
        if user.is_verified:
          self.abort_clean(
              'The subscription for "%s" has already been verified.' % user.email)
        else:
          user.is_verified = True
    if 'isEnabled' in body:
      user.is_enabled = body.get('isEnabled')

    user.put()

    self.response.write(json.dumps(user.to_dict()))
    self.response.headers['Content-Type'] = 'application/json'


class Ideas(BaseHandler):
  """RESTful endpoint for listing ideas."""

  # @auth.request_validator
  # def get(self, user):
  #   ideas = models.Idea.query(ancestor=user.key).fetch()
  #   idea_dicts = [idea.to_dict() for idea in ideas]
  #   self.response.write(json.dumps({'ideas': idea_dicts}, default=serializer))
  #   self.response.headers['Content-Type'] = 'application/json'

  def get(self, user_id):
    self.response.write('{"ideas": [{"date": "2016-11-16T17:02:10.340130", "text": "lovely"}, {"date": "2016-11-16T17:02:09.356260", "text": "and again"}, {"date": "2016-11-16T17:02:06.363380", "text": "this time."}, {"date": "2016-11-16T17:02:03.339190", "text": "Testing another time."}, {"date": "2016-11-16T16:59:59.232290", "text": "This is an idea!"}, {"date": "2016-11-16T17:02:08.313220", "text": "ok"}, {"date": "2016-11-16T17:02:04.363750", "text": "Making progress!"}, {"date": "2016-11-16T16:45:58.841040", "text": "Now you should work!"}, {"date": "2016-11-16T17:02:07.381850", "text": "yea!"}, {"date": "2016-11-16T17:02:03.435110", "text": "Testing another time again."}, {"date": "2016-11-16T17:02:01.633100", "text": "Testing again!"}, {"date": "2016-11-16T17:02:11.349070", "text": "yep"}, {"date": "2016-11-16T17:02:05.315310", "text": "Test."}]}')
    self.response.headers['Content-Type'] = 'application/json'
    # TODO(maxh): pagination

  def post(self):
    me = models.User.query(models.User.email == 'maxheinritz@gmail.com').get()
    ideas = models.Idea.query(ancestor=me).get()
    idea = models.Idea(parent=me.key, text='this is an idea', date=datetime.now())
    idea.put()


# Add PATCH support to webapp2.
allowed_methods = webapp2.WSGIApplication.allowed_methods
new_allowed_methods = allowed_methods.union(('PATCH',))
webapp2.WSGIApplication.allowed_methods = new_allowed_methods


app = webapp2.WSGIApplication([
  webapp2.Route(r'/api/users/<user_id:[^/]*>/ideas', Ideas),
  webapp2.Route(r'/api/users/<user_id:[^/]*>', Users),
  webapp2.Route(r'/api/users', Users),
], debug=config.DEBUG)


def serializer(obj):
  """JSON serializer for objects not serializable by default json code"""
  if isinstance(obj, datetime.datetime):
    serial = obj.isoformat()
    return serial
  raise TypeError ("Type not serializable")
