"""Base classes for the API."""

import datetime
import json
import logging
import webapp2

from validate_email import validate_email


class CleanException(webapp2.HTTPException):
  def __init__(self, message, email):
    self.code = 400
    self.message = message
    self.email = email


class BaseHandler(webapp2.RequestHandler):

  def handle_exception(self, exception, debug):

    result = None
    try:
      if isinstance(exception, webapp2.HTTPException):
        self.response.set_status(exception.code)
        result = {'message': exception.message}
        if isinstance(exception, CleanException):
          logging.info(exception)
          if exception.email is not None:
            # Include the email address in case it's useful.
            result['email'] = exception.email
        else:
          logging.exception(exception)
    except:
      pass

    if result is None:
      result = {'message': 'Unknown server error.'}
      self.response.set_status(500)

    self.response.write(json.dumps(result))
    self.response.headers['Content-Type'] = 'application/json'

  def abort_clean(self, message, email=None):
    raise CleanException(message, email)


def serializer(obj):
  """JSON serializer for objects not serializable by default json code"""
  if isinstance(obj, datetime.datetime):
    serial = obj.isoformat()
    return serial
  raise TypeError('Type not serializable.')
