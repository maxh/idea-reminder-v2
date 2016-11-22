"""Tests for authentication."""

import json
import urlparse
import unittest
import webapp2
import webtest

from google.appengine.api import memcache
from google.appengine.ext import ndb
from google.appengine.ext import testbed

import api_base
import auth
import models
import secrets


class MockUserHandler(api_base.BaseHandler):

  @auth.require_credentials
  def get(self, user):
    self.response.write(json.dumps(user.to_dict(), default=api_base.serializer))
    self.response.headers['Content-Type'] = 'application/json'


mock_app = webapp2.WSGIApplication([
  webapp2.Route(r'/api/users/<user_id:[^/]*>', MockUserHandler),
])


class ReceiveTestCase(unittest.TestCase):

  def setUp(self):
    self.testbed = testbed.Testbed()
    self.testbed.activate()
    self.testbed.init_datastore_v3_stub()
    self.testbed.init_memcache_stub()

    # This prevents data from leaking between tests.
    ndb.get_context().set_cache_policy(False)

    self.testapp = webtest.TestApp(mock_app)

    self.test_email = 'foo@bar.com'
    self.test_user = models.User(email=self.test_email)
    self.test_user.put()
    self.test_user_id = self.test_user.key.urlsafe()

    self.test_link = auth.generate_link(self.test_user, 'baz')

  def tearDown(self):
    self.testbed.deactivate()

  def test_generate_link(self):
    user = models.User(email='user@example.com')
    user.put()
    link = auth.generate_link(user, 'verify')
    self.assertTrue('/verify' in link)
    self.assertTrue('userId=' in link)
    self.assertTrue('linkCode=' in link)

  def test_bad_user_id(self):
    response = self.testapp.get('/api/users/foo', expect_errors=True)
    self.assertTrue('Unknown user ID.' in response.body)
    self.assertEqual(response.status_int, 400)

  def test_no_link_code(self):
    response = self.testapp.get('/api/users/%s' % self.test_user_id,
      expect_errors=True)
    self.assertTrue('This link has expired.' in response.body)
    self.assertEqual(response.status_int, 400)

  def test_invalid_link_code(self):
    response = self.testapp.get('/api/users/%s' % self.test_user_id, headers={
      'X-IdeaReminder-LinkCode': 'foo'
    }, expect_errors=True)
    self.assertTrue('This link has expired.' in response.body)
    self.assertEqual(response.status_int, 400)

  def test_valid_link_code(self):
    parsed = urlparse.urlparse(self.test_link)
    link_code = urlparse.parse_qs(parsed.query)['linkCode'][0]

    response = self.testapp.get('/api/users/%s' % self.test_user_id, headers={
      'X-IdeaReminder-LinkCode': link_code
    })
    self.assertTrue(self.test_email in response.body)