import React from 'react';

import { IndexRoute, Redirect, Router, Route, browserHistory } from 'react-router';

import AppBar from './AppBar';
import Home from './Home';
import List from './List';
import Unsubscribe from './Unsubscribe';
import Verify from './Verify';



const Main = (props) => {
  return (
    <div className={props.location.pathname}>
      <AppBar />
      <div className="container content-container">
        {props.children}
      </div>
    </div>
  )
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


const App = () => {
  return (
    <Router history={browserHistory}>
      <Route path="/" component={Main}>
        <IndexRoute component={Home} />
        <Route path="donate" component={Donate} />
        <Route path="list/:userId/:linkCode" component={List} />
        <Route path="verify/:userId/:linkCode" component={Verify} />
        <Route path="unsubscribe/:userId/:linkCode" component={Unsubscribe} />
        <Route path='/404' component={NotFound} />
        <Redirect from='*' to='/404' />
      </Route>
    </Router>
  );
}

export default App;