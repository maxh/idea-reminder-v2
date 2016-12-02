import React from 'react';

import { IndexRoute, Redirect, Router, Route } from 'react-router';

import AppBar from './AppBar';
import Donate from './Donate';
import Home from './Home';
import List from './List';
import Settings from './Settings';
import SignIn from './SignIn';
import Unsubscribe from './Unsubscribe';

import { requireAuth } from '../infra/requireAuth';

const Main = (props) => {
  return (
    <div className={props.location.pathname}>
      <AppBar />
      <div className="container content-container">
        {props.children}
      </div>
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
        <Route path="/donate" component={Donate} />
        <Route path="/sign-in" component={SignIn} />
        <Route path="/list" component={requireAuth(List)} />
        <Route path="/settings" component={requireAuth(Settings)} />
        <Route path="/unsubscribe" component={requireAuth(Unsubscribe, true)} />
        <Route path='/404' component={NotFound} />
        <Redirect from='*' to='/404' />
      </Route>
    </Router>
  );
}

export default App;
