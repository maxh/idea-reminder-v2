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

# App Engine imports.
from google.appengine.api import mail
from google.appengine.ext import ndb


# Third-party imports.
import mailjet_rest
import requests_toolbelt.adapters.appengine

# App imports.
import config
import models
import secrets


# Use the App Engine requests adapter to allow the requests library to be
# used on App Engine.
requests_toolbelt.adapters.appengine.monkeypatch()


TEMPLATES = jinja2.Environment(
    loader=jinja2.FileSystemLoader(
        os.path.dirname(__file__) + '/emails/'),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

TEMPLATES.globals = {
  'app_name': config.APP_NAME,
  'github_url': config.GITHUB_URL
}

class SendEmails(webapp2.RequestHandler):

  def get(self):
    # Load the template in advance to avoid getting the template once for
    # each user.
    template = TEMPLATES.get_template('reminder.html')
    enabled = models.User.query(models.User.is_enabled == True)
    active = enabled.filter(models.User.is_verified == True)
    for user in active.fetch():
      send_email_from_template(user.email, user.file_id, template)


class HandleReply(webapp2.RequestHandler):

  def validate_simple_auth(self):
    auth = self.request.authorization
    if auth is None:
      self.abort(401, 'Authorization required.')
    encoded_auth = auth[1]
    username_colon_pass = base64.b64decode(encoded_auth)
    username, password = username_colon_pass.split(':')
    # Comment
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
    user = models.User.query(models.User.email == email).get()
    if user is None or not user.is_verified:
      self.abort(400, 'Unrecognized email address: %s' % email)

    full_email_text = body.get('Text-part')
    idea_text = extract_latest_message(full_email_text)

    idea = models.Idea(parent=user.key, text=idea_text, date=datetime.now())
    idea.put()


routes = [
    ('/mail/send', SendEmails),
    ('/mail/receive', HandleReply)
]

app = webapp2.WSGIApplication(routes, debug=config.DEBUG)


##############################
### Mail helper functions. ###
##############################


def extract_latest_message(full_email_text):
  # re.DOTALL matches new lines; we strip everything after the old message.
  old_messages_regexp = re.compile('(\n+On .*wrote.*:.*)', re.DOTALL)
  latest_message = old_messages_regexp.sub(r'', full_email_text)
  return latest_message.rstrip()


def send_email_from_template(user_email, template, params):
  # "template" can be a string or an actual Jinja template.
  if isinstance(template, basestring):
    template = TEMPLATES.get_template(template + '.html')
  html_body = template.render(format='html', **params)
  body = template.render(**params)
  send_email(user_email, template.module.subject, body, html_body)


def send_email(address, subject, text_part, html_part):
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