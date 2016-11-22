import os

APP_NAME = 'Idea Reminder'

APP_ID = 'idea-reminder-two'
EMAIL_SENDER = 'Idea Reminder <postman@idea-reminder.appspotmail.com>'
GITHUB_LINK = 'https://github.com/maxh/idea-reminder/issues'


if (os.getenv('SERVER_SOFTWARE', '').startswith('Google App Engine') or
    os.getenv('SETTINGS_MODE') == 'prod'):
  PROD = True
  URL = 'idea-reminder-two.appspot.com'
else:
  PROD = False
  URL = 'idea-reminder-two.appspot.com'


DEBUG = not PROD