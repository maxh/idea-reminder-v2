import json
import logging
import unittest
import webapp2
import webtest

from google.appengine.api import memcache
from google.appengine.ext import ndb
from google.appengine.ext import testbed

import api
import models
import secrets

ACCOUNT_ID = 'fake_account_id'

class ApiTestCase(unittest.TestCase):

  def setUp(self):
    self.app = webtest.TestApp(api.app)

    self.testbed = testbed.Testbed()
    self.testbed.activate()
    self.testbed.init_datastore_v3_stub()
    self.testbed.init_memcache_stub()
    self.testbed.setup_env(
        account_id_override=ACCOUNT_ID,
        overwrite=True)

    # This prevents data from leaking between tests.
    ndb.get_context().set_cache_policy(False)

    email = 'account@example.com'
    account = models.Account(id=ACCOUNT_ID, email=email)
    account.put()

    for i in range(0, 89):
      models.Response(
          parent=account.key,
          text='My idea number %s.' % i).put()

  def tearDown(self):
    self.testbed.deactivate()

  def test_pagination(self):

    resp = self.app.get('/api/responses')

    self.assertEqual(resp.headers['Link'], (
        '<idea-reminder-two.appspot.com/api/responses?&limit=25&offset=25>; rel="next",'
        '<idea-reminder-two.appspot.com/api/responses?&limit=25&offset=75>; rel="last"'))

  def test_csv(self):

    resp = self.app.get('/api/responses?format=csv')

    self.assertEqual(len(resp.body.split('\n')), 90)