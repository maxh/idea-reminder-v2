from datetime import datetime
import webapp2

from google.appengine.ext import ndb

import config
import models
import secrets
import mail


class DeleteExpiredLinks(webapp2.RequestHandler):

  def get(self):

    expired_link_entities = (models.Link.query()
        .filter(models.Link.expiration < datetime.now())
    )
    ndb.delete_multi(ndb.put_multi(expired_link_entities))


app = webapp2.WSGIApplication([
    ('/tasks/delete-links', DeleteExpiredLinks),
    ('/tasks/receive-response', mail.HandleReply),
], debug=config.DEBUG)