Tools:

  - virtualenv for isolating the dev_appserver python environment
  - https://github.com/Khan/frankenserver so that dev_appserver.py ignores
    client npm dependences and autoloads changed server files.

Set up:

    $ virtualenv env
    $ source env/bin/activate
    $ pip install -t server/lib -r requirements.txt
    $ cd client
    $ npm install

Test:

    $ python test_runner.py

To download a local copy of the database to play with:

    $ ~/tools/frankenserver/python/appcfg.py download_data \
        --application=s~idea-reminder-two \
        --url=http://idea-reminder-two.appspot.com/_ah/remote_api \
        --kind=Responses \
        --filename=database.ndb

    $ ~/tools/frankenserver/python/appcfg.py upload_data \
        --application=dev~idea-reminder-two \
        --url=http://localhost:53828/_ah/remote_api \
        --filename=database.ndb
