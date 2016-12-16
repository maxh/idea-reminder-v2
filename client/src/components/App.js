import React from 'react';

import { IndexRoute, Redirect, Router, Route } from 'react-router';

import AppBar from './AppBar';
import Donate from './Donate';
import About from './About';
import Home from './Home';
import Responses from './Responses';
import Settings from './Settings';
import SignIn from './SignIn';
import Terms from './Terms';
import Unsubscribe from './Unsubscribe';

import { requireAuth } from '../infra/requireAuth';

const Main = (props) => {
  return (
    <div className={props.location.pathname}>
      <AppBar />
      <div className="container content-container">
        {props.children}
      </div>
      <footer>
        <a href="mailto:hello@ideareminder.com">Contact</a>
        <span>|</span>
        <a href="/terms">Privacy and Terms</a>
      </footer>
    </div>
  );
}

const NotFound = () => {
  return <div>Oops! We couldn't find that page.</div>;
}

const App = (props) => {
  return (
    <Router history={props.history}>
      <Route path="/" component={Main}>
        <IndexRoute component={Home} />
        <Route path="/about" component={About} />
        <Route path="/donate" component={Donate} />
        <Route path="/sign-in" component={SignIn} />
        <Route path="/unsubscribe" component={Unsubscribe} />
        <Route path="/terms" component={Terms} />
        <Route path="/responses" component={requireAuth(Responses)} />
        <Route path="/settings" component={requireAuth(Settings)} />
        <Route path='/404' component={NotFound} />
        <Redirect from='*' to='/404' />
      </Route>
    </Router>
  );
}

export default App;
