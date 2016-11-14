from google.appengine.ext import ndb


class User(ndb.Model):
  email = ndb.StringProperty(required=True)
  is_verified = ndb.BooleanProperty(default=False, required=True)
  is_enabled = ndb.BooleanProperty(default=True, required=True)


class Link(ndb.Model):
  link_code = ndb.StringProperty(required=True)
  expiration = ndb.DateTimeProperty(required=True)


class Idea(ndb.Model):
  date = ndb.DateTimeProperty(required=True)
  text = ndb.TextProperty(required=True)