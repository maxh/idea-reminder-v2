import React from 'react';
import 'react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.min.css';
import AppBar from './AppBar.js';
import Switch from 'react-bootstrap-switch';
import { IndexRoute, Router, Route, browserHistory } from 'react-router';
import Home from './Home.js';
import Login from './Login.js';


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

const Settings = () => {
  return (
    <div>
      <label>Send emails</label>
      <Switch />
    </div>
  );
}

const App = () => {
  return (
    <Router history={browserHistory}>
      <Route path="/" component={Main}>
        <IndexRoute component={Home} />
        <Route path="settings" component={Settings} />
        <Route path="log-in" component={Login} />
        <Route path="log-out" component={Login} />
      </Route>
    </Router>
  );
}

export default App;