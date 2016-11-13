import datetime
import json
import logging
import posixpath
import random
import string
import webapp2

from validate_email import validate_email

import config
import mail
import models


class BaseHandler(webapp2.RequestHandler):

  def handle_exception(self, exception, debug):
    logging.exception(exception)
    logging.info('Exception handled.')

    if isinstance(exception, webapp2.HTTPException):
      try:
        result = {
            'status': 'error',
            'status_code': exception.code,
            'message': exception.explanation,
         }
        self.response.write(json.dumps(result))
        self.response.set_status(exception.code)
        self.response.headers['Content-Type'] = 'application/json'
        return
      except:
        pass

    self.response.set_status(500)


class Verify(BaseHandler):

  def post(self):
    body = json.loads(self.request.body)
    code = body.get('code')

    link = models.Link.query(models.Link.code == code).get()
    if link is None or link.expiration < datetime.datetime.now():
      self.abort(
          400, explanation='This verification code has expired.')

    account = models.Account.query(models.Account.email == link.email).get()
    if account.verified:
      self.abort(
        400, explanation='The subscription for "%s" has already been verified.' % link.email)

    account.verified = True
    account.put()
    self.response.write(json.dumps({'email': link.email}))
    self.response.headers['Content-Type'] = 'application/json'


class List(BaseHandler):

  def get(self):
    body = json.loads(self.request.body)
    code = body.get('code')

    link = models.Link.query(models.Link.code == code).get()
    if link is None or link.expiration < datetime.datetime.now():
      self.abort(
          400, explanation='This verification code has expired.')

    account = models.Account.query(models.Account.email == link.email).get()
    ideas = models.Idea.query(models.Idea.customer == account.key).fetch()

    account.verified = True
    account.put()
    self.response.write(json.dumps({'email': link.email}))
    self.response.headers['Content-Type'] = 'application/json'


class Subscribe(BaseHandler):

  def post(self):
    body = json.loads(self.request.body)
    email = body.get('email')

    if email is None or email == '':
      self.abort(400, explanation='Please enter an email address.')

    if not validate_email(email):
      self.abort(
          400, explanation='The email address "%s" is invalid.' % email)

    if models.Account.query(models.Account.email == email).get():
      self.abort(
          400,
          explanation='The email address "%s" is already subscribed.' % email)

    expiration = datetime.datetime.now() + datetime.timedelta(days=7)
    code = id_generator()
    models.Link(email=email, expiration=expiration, code=code).put()
    link = posixpath.join(config.URL, 'verify/%s' % code)
    mail.send_email_from_template(email, 'welcome', {'verification_link': link})

    account = models.Account(email=email)
    account.put()


def id_generator(size=100, chars=string.ascii_lowercase + string.digits):
  return ''.join(random.choice(chars) for _ in range(size))

app = webapp2.WSGIApplication([
  ('/api/subscribe', Subscribe),
  ('/api/verify', Verify),
  ('/api/list', List),
], debug=True)