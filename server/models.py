from google.appengine.ext import ndb


class User(ndb.Model):
  email = ndb.StringProperty(required=True)
  user_id = ndb.StringProperty(required=True)
  isVerified = ndb.BooleanProperty(default=False, required=True)
  isDisabled = ndb.BooleanProperty(default=False, required=True)


class Link(ndb.Model):
  link_code = ndb.StringProperty(required=True)
  user_id = ndb.StringProperty(required=True)
  expiration = ndb.DateTimeProperty(required=True)


class Idea(ndb.Model):
  date = ndb.DateTimeProperty(required=True)
  text = ndb.TextProperty(required=True)