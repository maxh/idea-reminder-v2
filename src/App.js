import React from 'react';
import './App.css';
import 'react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.min.css';
import AppBar from './AppBar.js';
import Switch from 'react-bootstrap-switch';
import { Button, Jumbotron, Grid, Row } from 'react-bootstrap';
import { IndexRoute, Router, Route, browserHistory } from 'react-router'


const Main = (props) => {
  return (
    <div>
      <AppBar />
      <Grid>
        <Row>
          {props.children}
        </Row>
      </Grid>
    </div>
  )
}

const Home = () => {
  return (
    <Jumbotron>
      <h2>Encourage a daily creative spark.</h2>
      <p><Button bsStyle="primary">Get started</Button></p>
    </Jumbotron>
  );
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
        <Route path="settings" component={Settings} />
      </Route>
    </Router>
  );
}

export default App;