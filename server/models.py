from google.appengine.ext import ndb


class Account(ndb.Model):
  email = ndb.StringProperty(required=True)
  verified = ndb.BooleanProperty(default=False, required=True)
  disabled = ndb.BooleanProperty(default=False, required=True)


class Link(ndb.Model):
  code = ndb.StringProperty(required=True)
  email = ndb.StringProperty(required=True)
  expiration = ndb.DateTimeProperty(required=True)


class Idea(ndb.Model):
  date = ndb.DateTimeProperty(required=True)
  text = ndb.TextProperty(required=True)