""" mail.py:
    Sends reminder emails and handles their responses and defines a few helper
    functions for sending email.
"""

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
    users = models.User.query(models.User.unsubscribed == False).fetch()
    for user in users:
      send_email_from_template(user.email, user.file_id, template)


class HandleReply(webapp2.RequestHandler):

  def is_valid_auth(auth):
    encoded_auth = auth[1]
    username_colon_pass = base64.b64decode(encoded_auth)
    username, password = username_colon_pass.split(':')
    return (
        username == secrets.MJ_PARSE_USERNAME and
        password == secrets.MJ_PARSE_PASSWORD)

  def post(self):
    auth = self.request.authorization
    if auth is None or not is_valid_auth(auth):
      self.abort(401, 'Authorization required.')
    body = json.loads(self.request.body)
    text_part = body.get('Text-part')
    logging.info('text_part: ' + text_part)
    email = body.get('Sender')
    logging.info('email: ' + email)
    date = body.get('date')
    logging.info('date: ' + date)

    account = models.Account.query(models.Account.email == link.email).fetch()
    idea = models.Idea(parent=account.key(), text=text, date=datetime.now())
    idea.put()


routes = [
    ('/mail/send', SendEmails),
    ('/mail/receive', HandleReply)
]

app = webapp2.WSGIApplication(routes, debug=config.DEBUG)


##############################
### Mail helper functions. ###
##############################


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
  logging.info('sent email')