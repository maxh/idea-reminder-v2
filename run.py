import importlib
import os
import sys

command = sys.argv[1]

if command == 'deploy':
  os.system('gcloud app deploy')

if command == 'test':
  test = importlib.import_module('server.%s' % sys.argv[2])
  test.unittest.main()