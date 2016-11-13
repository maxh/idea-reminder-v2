To install Python dependencies, ideally we could run:

    pip install -t server/lib -r requirements.txt

But this doesn't work with Homebrew Python.  So we need to use a venv:

    virtualenv env
    source env/bin/activate
    ln -s env/lib/python2.7/site-packages lib. # Not sure this is needed?
    pip install -t server/lib -r requirements.txt

To run:

