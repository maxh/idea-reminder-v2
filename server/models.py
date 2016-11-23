from google.appengine.ext import ndb


class Account(ndb.Model):
  email = ndb.StringProperty(required=True)
  sign_up_date = ndb.DateTimeProperty(auto_now_add=True)
  time_of_day = ndb.StringProperty(required=True, default='morning')  # Can be "morning" or "evening".
  last_response_date = ndb.DateTimeProperty()
  emails_enabled = ndb.BooleanProperty(required=True, default=True)


class Link(ndb.Model):
  link_code = ndb.StringProperty(required=True)
  expiration = ndb.DateTimeProperty(required=True)


class Response(ndb.Model):
  date = ndb.DateTimeProperty(auto_now_add=True)
  text = ndb.TextProperty(required=True)