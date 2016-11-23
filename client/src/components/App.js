import React from 'react';

import { IndexRoute, Redirect, Router, Route } from 'react-router';

import { connect } from 'react-redux';

import AppBar from './AppBar';
import Home from './Home';
import List from './List';
import Unsubscribe from './Unsubscribe';

import { requireAuth } from '../lib/requireAuthentication';


class StaticMain extends React.Component {
  render() {
    return (
      <div className={this.props.location.pathname}>
        <AppBar />
        <div className="container content-container">
          {this.props.children}
        </div>
      </div>
    )
  }
}

const SignIn = () => {
  return (
    <div>
      Please sign in to continue.
    </div>
  );
}

const Donate = () => {
  return (
    <div>
      Donate
    </div>
  );
}

const NotFound = () => {
  return (
    <div>
      Oops! We couldn't find that page.
    </div>
  );
}

const App = (props) => {
  return (
    <Router history={props.history}>
      <Route path="/" component={StaticMain}>
        <IndexRoute component={Home} />
        <Route path="/donate" component={Donate} />
        <Route path="/sign-in" component={SignIn} />
        <Route path="/list" component={requireAuth(List)} />
        <Route path="/unsubscribe" component={requireAuth(Unsubscribe)} />
        <Route path='/404' component={NotFound} />
        <Redirect from='*' to='/404' />
      </Route>
    </Router>
  );
}

export default App;