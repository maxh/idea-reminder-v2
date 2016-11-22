import React from 'react';

import { IndexRoute, Redirect, Router, Route } from 'react-router';

import { connect } from 'react-redux';

import AppBar from './AppBar';
import Home from './Home';
import List from './List';
import Unsubscribe from './Unsubscribe';
import Verify from './Verify';

import { fetchUser, setAuth } from '../actions/index.js'



class StaticMain extends React.Component {
  componentWillMount() {
    var query = this.props.location.query;
    this.props.setAuth(query.userId, query.linkCode);
    if (query.userId && query.linkCode) {
      this.props.fetchUser();
    }
  }
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

const Main = connect(null, {
  setAuth: setAuth,
  fetchUser: fetchUser
})(StaticMain);

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
      <Route path="/" component={Main}>
        <IndexRoute component={Home} />
        <Route path="/donate" component={Donate} />
        <Route path="/list" component={List} />
        <Route path="/unsubscribe" component={Unsubscribe} />
        <Route path="/verify" component={Verify} />
        <Route path='/404' component={NotFound} />
        <Redirect from='*' to='/404' />
      </Route>
    </Router>
  );
}

export default App;