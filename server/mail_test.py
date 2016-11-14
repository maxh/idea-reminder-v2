import json
import logging
import unittest
import webapp2
import webtest

from google.appengine.api import memcache
from google.appengine.ext import ndb
from google.appengine.ext import testbed

import mail
import models
import secrets

EXAMPLE_TEXT_PART = '''The greatest idea!!

On Sun, Nov 13, 2016 at 4:39 PM, Idea Reminder <mail@ideareminder.org>
wrote:

> Something something.
'''

class ReceiveTestCase(unittest.TestCase):

  def setUp(self):
    self.testbed = testbed.Testbed()
    self.testbed.activate()
    self.testbed.init_datastore_v3_stub()
    self.testbed.init_memcache_stub()

    # This prevents data from leaking between tests.
    ndb.get_context().set_cache_policy(False)

    self.testapp = webtest.TestApp(mail.app)
    self.testapp.authorization = ('Basic', (
        secrets.MJ_PARSE_USERNAME, secrets.MJ_PARSE_PASSWORD))

  def tearDown(self):
    self.testbed.deactivate()

  def test_receive_no_auth(self):
    no_auth_app = webtest.TestApp(mail.app)
    response = no_auth_app.post('/mail/receive', expect_errors=True)
    self.assertEqual(response.status_int, 401)

  def test_receive_bad_auth(self):
    bad_auth_app = webtest.TestApp(mail.app)
    bad_auth_app.authorization = ('Basic', ('fakeUser', 'fakePassword'))
    response = bad_auth_app.post('/mail/receive', expect_errors=True)
    self.assertEqual(response.status_int, 401)

  def test_no_json_body(self):
    response = self.testapp.post('/mail/receive', expect_errors=True)
    self.assertEqual(response.status_int, 400)

  def test_unknown_sender(self):
    response = self.testapp.post('/mail/receive', json.dumps({
      'Text-part': 'foo',
      'Sender': 'abc@123.com',
    }), expect_errors=True)
    self.assertEqual(response.status_int, 400)

  def test_unverified_sender(self):
    email = 'user@example.com'
    models.User(email=email).put()
    response = self.testapp.post('/mail/receive', json.dumps({
      'Text-part': 'foo',
      'Sender': email,
    }), expect_errors=True)
    self.assertEqual(response.status_int, 400)

  def test_verified_sender(self):
    email = 'user@example.com'
    user = models.User(email=email, is_verified=True)
    user.put()
    response = self.testapp.post('/mail/receive', json.dumps({
      'Text-part': 'foo',
      'Sender': email,
    }))
    self.assertEqual(response.status_int, 200)
    idea = models.Idea.query(ancestor=user.key).get()
    self.assertEqual(idea.text, 'foo')

  def test_extract_latest_message(self):
    latest = mail.extract_latest_message(EXAMPLE_TEXT_PART)
    self.assertEqual(latest, 'The greatest idea!!')

  def test_everything(self):
    email = 'user@example.com'
    user = models.User(email=email, is_verified=True)
    user.put()
    response = self.testapp.post('/mail/receive', json.dumps({
      'Text-part': EXAMPLE_TEXT_PART,
      'Sender': email,
    }))
    self.assertEqual(response.status_int, 200)
    idea = models.Idea.query(ancestor=user.key).get()
    self.assertEqual(idea.text, 'The greatest idea!!')
