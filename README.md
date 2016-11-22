Set up:

    $ virtualenv env
    $ source env/bin/activate
    $ pip install -t server/lib -r requirements.txt
    $ cd client
    $ npm install

Test:

    $ python test_runner.py