"""Rest API for users and ideas."""

import datetime
import json
import math
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

  @auth.require_link
  def post(self, account):
    account.emails_enabed = False
    account.put()
    self.response.write(json.dumps({}))
    self.response.headers['Content-Type'] = 'application/json'


class Responses(api_base.BaseHandler):
  """RESTful endpoint for listing ideas."""

  @auth.require_account
  def get(self, account):
    page = int(self.request.get('page', default_value=1))

    limit = 25
    offset = (page - 1) * limit
    count = models.Response.query(ancestor=account.key).count()
    max_page = int(math.ceil(count / limit) + 1)

    ideas = (models.Response
        .query(ancestor=account.key)
        .order(-models.Response.date))

    if 'csv' == self.request.get('format'):
      ideas = ideas.fetch()  # Fetch all ideas for CSV.
    else:
      ideas = ideas.fetch(offset=offset, limit=limit)

    # Format the ideas.
    formatted_ideas = []
    for idea in ideas:
      date_str = idea.date.isoformat().split('T')[0]
      formatted_ideas.append({'date': date_str, 'text': idea.text})

    if 'csv' == self.request.get('format'):
      rows = ['"date","idea"']
      for formatted in formatted_ideas: 
        rows.append('"%s","%s"' % (formatted['date'], formatted['text']))
      response = '\n'.join(rows)
      self.response.headers['Content-Type'] = 'text/csv'
    else:
      links = {}
      links['last'] = '%s/api/responses?&page=%s' % (config.URL, max_page)
      response = json.dumps({
        'ideas': formatted_ideas,
        'links': links
      })
      self.response.headers['Content-Type'] = 'application/json'

    self.response.write(response)    


  # @auth.require_account
  # def get(self, account):
  #   self.response.write('{"ideas": [{"date": "2016-11-16T17:02:10.340130", "text": "lovely"}, {"date": "2016-11-16T17:02:09.356260", "text": "and aasdfasdfasdfasdfasdfasdfasdfasdgainaasdfasdfasdfasdfasdfasdfasdfasdgainaasdfasdfasdfasdfasdfasdfasdfasdgainaasdfasdfasdfasdfasdfasdfasdfasdgain"}, {"date": "2016-11-16T17:02:06.363380", "text": "this time."}, {"date": "2016-11-16T17:02:03.339190", "text": "Testing another time aasdfasdfasdfasdfasdfasdfasdfasdgain aasdfasdfasdfasdfasdfasdfasdfasdgain aasdfasdfasdfasdfasdfasdfasdfasdgain aasdfasdfasdfasdfasdfasdfasdfasdgain aasdfasdfasdfasdfasdfasdfasdfasdgain aasdfasdfasdfasdfasdfasdfasdfasdgain aasdfasdfasdfasdfasdfasdfasdfasdgain aasdfasdfasdfasdfasdfasdfasdfasdgain."}, {"date": "2016-11-16T16:59:59.232290", "text": "This is an idea!"}, {"date": "2016-11-16T17:02:08.313220", "text": "ok"}, {"date": "2016-11-16T17:02:04.363750", "text": "Making progress!"}, {"date": "2016-11-16T16:45:58.841040", "text": "Now you should work!"}, {"date": "2016-11-16T17:02:07.381850", "text": "yea!"}, {"date": "2016-11-16T17:02:03.435110", "text": "Testing another time again."}, {"date": "2016-11-16T17:02:01.633100", "text": "Testing again!"}, {"date": "2016-11-16T17:02:11.349070", "text": "yep"}, {"date": "2016-11-16T17:02:05.315310", "text": "Test."}]}')
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
