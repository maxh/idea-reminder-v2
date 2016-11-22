"""Rest API for users and ideas."""

import datetime
import json
import webapp2

from validate_email import validate_email

import api_base
import auth
import config
import mail
import models


class Users(api_base.BaseHandler):
  """RESTful endpoints for creating and updating users."""

  def respond_with_user(self, user):
    self.response.write(json.dumps(user.to_dict(), default=api_base.serializer))
    self.response.headers['Content-Type'] = 'application/json'

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

    user = models.User(email=email, sign_up_date=datetime.datetime.now())
    user.put()

    mail.send_email_from_template(email, 'welcome', {
      'verification_link': auth.generate_link(user, 'verify')
    })

    self.respond_with_user(user)

  @auth.require_credentials
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

    self.respond_with_user(user)

  @auth.require_credentials
  def get(self, user):
    self.respond_with_user(user)


class Ideas(api_base.BaseHandler):
  """RESTful endpoint for listing ideas."""

  @auth.require_credentials
  def get(self, user):
    ideas = models.Idea.query(ancestor=user.key).fetch()
    idea_dicts = [idea.to_dict() for idea in ideas]
    self.response.write(json.dumps({'ideas': idea_dicts}, default=api_base.serializer))
    self.response.headers['Content-Type'] = 'application/json'

  # def get(self, user_id):
  #   self.response.write('{"ideas": [{"date": "2016-11-16T17:02:10.340130", "text": "lovely"}, {"date": "2016-11-16T17:02:09.356260", "text": "and again"}, {"date": "2016-11-16T17:02:06.363380", "text": "this time."}, {"date": "2016-11-16T17:02:03.339190", "text": "Testing another time."}, {"date": "2016-11-16T16:59:59.232290", "text": "This is an idea!"}, {"date": "2016-11-16T17:02:08.313220", "text": "ok"}, {"date": "2016-11-16T17:02:04.363750", "text": "Making progress!"}, {"date": "2016-11-16T16:45:58.841040", "text": "Now you should work!"}, {"date": "2016-11-16T17:02:07.381850", "text": "yea!"}, {"date": "2016-11-16T17:02:03.435110", "text": "Testing another time again."}, {"date": "2016-11-16T17:02:01.633100", "text": "Testing again!"}, {"date": "2016-11-16T17:02:11.349070", "text": "yep"}, {"date": "2016-11-16T17:02:05.315310", "text": "Test."}]}')
  #   self.response.headers['Content-Type'] = 'application/json'

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
