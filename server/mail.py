""" mail.py:
    Sends reminder emails and handles their responses and defines a few helper
    functions for sending email.
"""

import base64
from datetime import datetime
import jinja2
import json
import logging
import os
import re
import webapp2


# Third-party imports.
import mailjet_rest
import requests_toolbelt.adapters.appengine

# App imports.
import auth
import config
import models
import secrets


# Use the App Engine requests adapter to allow the requests library to be
# used on App Engine. Mailjet needs requests.
requests_toolbelt.adapters.appengine.monkeypatch()


TEMPLATES = jinja2.Environment(
    loader=jinja2.FileSystemLoader(
        os.path.dirname(__file__) + '/emails/'),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

TEMPLATES.globals = {
  'app_name': config.APP_NAME,
  'github_link': config.GITHUB_LINK
}


class SendReminders(webapp2.RequestHandler):

  def get(self, time_of_day):
    template = TEMPLATES.get_template('reminder.html')

    accounts = (models.Account.query()
        .filter(models.Account.emails_enabled == True)
        .filter(models.Account.time_of_day == time_of_day)
    )

    for account in accounts.fetch():
      params = {
        'responses_link': config.URL + '/responses',
        'unsubscribe_link': auth.generate_link(account, 'unsubscribe'),
      }
      send_email_from_template(account.email, template, params)


class HandleReply(webapp2.RequestHandler):

  def validate_simple_auth(self):
    """Validates simple HTTP auth from Mailjet."""
    auth = self.request.authorization
    if auth is None:
      self.abort(401, 'Authorization required.')
    encoded_auth = auth[1]
    username_colon_pass = base64.b64decode(encoded_auth)
    username, password = username_colon_pass.split(':')
    if (username != secrets.MJ_PARSE_USERNAME or
        password != secrets.MJ_PARSE_PASSWORD):
      self.abort(401, 'Invalid credentials.')

  def post(self):
    self.validate_simple_auth()

    try:
      body = json.loads(self.request.body)
    except ValueError:
      self.abort(400, 'Expected JSON email description.')

    email = body.get('Sender')
    account = models.Account.query(models.Account.email == email).get()
    if account is None:
      self.abort(400, 'Unrecognized email address: %s' % email)

    account.last_response_date = datetime.now()
    account.put()

    full_email_text = body.get('Text-part')
    response_text = extract_latest_message(full_email_text)

    response = models.Response(
        parent=account.key,
        text=response_text)
    response.put()


app = webapp2.WSGIApplication([
    webapp2.Route('/mail/send-reminders/<time_of_day:[\w]*>', SendReminders),
    ('/mail/receive', HandleReply),
], debug=config.DEBUG)


##############################
### Mail helper functions. ###
##############################


def extract_latest_message(full_email_text):
  # re.DOTALL matches new lines; we strip everything after the old message.
  old_messages_regexp = re.compile('(\n+On .*wrote.*:.*)', re.DOTALL)
  latest_message = old_messages_regexp.sub(r'', full_email_text)
  return latest_message.rstrip()


def send_email_from_template(email_address, template, params={}):
  # "template" can be a string or an actual Jinja template.
  if isinstance(template, basestring):
    template = TEMPLATES.get_template(template + '.html')
  html_body = template.render(format='html', **params)
  body = template.render(**params)
  send_email(email_address, template.module.subject, body, html_body)


def send_email(address, subject, text_part, html_part=None):
  mailjet = mailjet_rest.Client(
      auth=(secrets.MJ_APIKEY_PUBLIC, secrets.MJ_APIKEY_PRIVATE))
  data = {
      'FromEmail': 'mail@ideareminder.org',
      'FromName': 'Idea Reminder',
      'Subject': subject,
      'Text-part': text_part,
      'Html-part': html_part,
      'Recipients': [{'Email': address}]
  }
  result = mailjet.send.create(data=data)
  logging.info(result.json())