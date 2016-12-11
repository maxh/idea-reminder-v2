import os

APP_NAME = 'Idea Reminder'

APP_ID = 'idea-reminder-two'
EMAIL_SENDER = 'Idea Reminder <postman@idea-reminder.appspotmail.com>'
GITHUB_LINK = 'https://github.com/maxh/idea-reminder/issues'

CLIENT_ID = '116575144698-gk68303mu8j2snb048ajsdq9mhe3s56u.apps.googleusercontent.com'

URL = 'idea-reminder-two.appspot.com'

if (os.getenv('SERVER_SOFTWARE', '').startswith('Google App Engine') or
    os.getenv('SETTINGS_MODE') == 'prod'):
  PROD = True
else:
  PROD = False


DEBUG = not PROD