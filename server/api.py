"""Rest API for users and ideas."""

import datetime
import json
import webapp2

from validate_email import validate_email

from google.appengine.ext import ndb

import api_base
import auth
import config
import mail
import models


class Account(api_base.BaseHandler):

  def respond(self, account):
    # TODO: Camelize keys.
    self.response.write(json.dumps(account.to_dict(), default=api_base.serializer))
    self.response.headers['Content-Type'] = 'application/json'

  @auth.require_token
  def post(self, token_info):
    email = token_info.get('email')
    sub = token_info.get('sub')

    account = ndb.Key(models.Account, sub).get()
    if account is None:
      try:
        account = models.Account(id=sub, email=email)
        mail.send_email_from_template(email, 'welcome')
        account.put()
      except Exception:
        self.abort(500, 'Unable to create account.')


    self.respond(account)


  @auth.require_account
  def patch(self, account):
    body = json.loads(self.request.body)

    if 'emailsEnabled' in body:
      account.emails_enabled = body.get('emailsEnabled')
    if 'timeOfDay' in body:
      account.time_of_day = body.get('timeOfDay')
    account.put()

    self.respond(account)


  @auth.require_account
  def get(self, account):
    self.respond(account)


class Unsubscribe(api_base.BaseHandler):

  def post(self, account):
    body = json.loads(self.request.body)

    if 'emailsEnabled' in body:
      account.emails_enabled = body.get('emailsEnabled')
    if 'timeOfDay' in body:
      account.time_of_day = body.get('timeOfDay')
    account.put()

    self.respond(account)


class Responses(api_base.BaseHandler):
  """RESTful endpoint for listing ideas."""

  @auth.require_account
  def get(self, account):
    ideas = models.Idea.query(ancestor=account.key).fetch()
    idea_dicts = [idea.to_dict() for idea in ideas]
    self.response.write(json.dumps({'ideas': idea_dicts}, default=api_base.serializer))
    self.response.headers['Content-Type'] = 'application/json'

  # @auth.require_account
  # def get(self, account):
  #   self.response.write('{"ideas": [{"date": "2016-11-16T17:02:10.340130", "text": "lovely"}, {"date": "2016-11-16T17:02:09.356260", "text": "and again"}, {"date": "2016-11-16T17:02:06.363380", "text": "this time."}, {"date": "2016-11-16T17:02:03.339190", "text": "Testing another time."}, {"date": "2016-11-16T16:59:59.232290", "text": "This is an idea!"}, {"date": "2016-11-16T17:02:08.313220", "text": "ok"}, {"date": "2016-11-16T17:02:04.363750", "text": "Making progress!"}, {"date": "2016-11-16T16:45:58.841040", "text": "Now you should work!"}, {"date": "2016-11-16T17:02:07.381850", "text": "yea!"}, {"date": "2016-11-16T17:02:03.435110", "text": "Testing another time again."}, {"date": "2016-11-16T17:02:01.633100", "text": "Testing again!"}, {"date": "2016-11-16T17:02:11.349070", "text": "yep"}, {"date": "2016-11-16T17:02:05.315310", "text": "Test."}]}')
  #   self.response.headers['Content-Type'] = 'application/json'


# Add PATCH support to webapp2.
allowed_methods = webapp2.WSGIApplication.allowed_methods
new_allowed_methods = allowed_methods.union(('PATCH',))
webapp2.WSGIApplication.allowed_methods = new_allowed_methods


app = webapp2.WSGIApplication([
  ('/api/account', Account),
  ('/api/responses', Responses),
  ('/api/unsubscribe', Unsubscribe)
], debug=config.DEBUG)
