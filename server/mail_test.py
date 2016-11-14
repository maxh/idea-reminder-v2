import sys
sys.path.insert(1, '/Users/max/tools/google-cloud-sdk/platform/google_appengine')
sys.path.insert(1, '/Users/max/tools/google-cloud-sdk/platform/google_appengine/lib/webapp2-2.5.2')
sys.path.insert(1, '/Users/max/tools/google-cloud-sdk/platform/google_appengine/lib/webob-1.2.3')
sys.path.insert(1, '/Users/max/tools/google-cloud-sdk/platform/google_appengine/lib/jinja2-2.6')
sys.path.insert(1, '/Users/max/tools/google-cloud-sdk/platform/google_appengine/lib/yaml/lib')
sys.path.insert(1, '/Users/max/projects/idea-reminder-two/server/lib')

import json
import logging
import unittest
import webapp2
import webtest

import mail
import secrets



class TestHandlers(unittest.TestCase):

  def setUp(self):
    self.testapp = webtest.TestApp(mail.app)
    self.testapp.authorization = ('Basic', (
        secrets.MJ_PARSE_USERNAME, secrets.MJ_PARSE_PASSWORD))

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

  def test_no_json_body(self):
    response = self.testapp.post('/mail/receive', {''})
    self.assertEqual(response.status_int, 400)

if __name__ == '__main__':
  unittest.main()