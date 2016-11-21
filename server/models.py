from google.appengine.ext import ndb


class User(ndb.Model):
  email = ndb.StringProperty(required=True)
  sign_up_date = ndb.DateTimeProperty(required=True)
  last_response_date = ndb.DateTimeProperty()
  is_verified = ndb.BooleanProperty(required=True, default=False)
  is_enabled = ndb.BooleanProperty(required=True, default=True)


class Link(ndb.Model):
  link_code = ndb.StringProperty(required=True)
  expiration = ndb.DateTimeProperty(required=True)


class Idea(ndb.Model):
  date = ndb.DateTimeProperty(required=True)
  text = ndb.TextProperty(required=True)