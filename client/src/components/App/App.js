import React from 'react';
import 'react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.min.css';
import AppBar from '../AppBar/AppBar.js';
import Switch from 'react-bootstrap-switch';
import { IndexRoute, Router, Route, browserHistory } from 'react-router';
import Home from '../Home/Home.js';
import { connect } from 'react-redux';
import { startVerify } from '../../actions/index.js';


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

class Verify extends React.Component {
  componentWillMount() {
    var params = this.props.params;
    this.props.verify(params.userId, params.linkCode);
  }
  render() {
    var message;
    if (this.props.isFetching) {
      message = 'Verifying...';
    } else if (this.props.verifiedEmail) {
      message = `The subscription for "${this.props.verifiedEmail}" has been verified. Thanks!`;
    } else {
      message = this.props.errorMessage || 'Unable to verify email address.';
    }
    return (
      <div style={{'textAlign': 'center'}}>{message}</div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isFetching: state.verify.isFetching,
    verifiedEmail: state.verify.verifiedEmail,
    errorMessage: state.verify.errorMessage
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    verify: (userId, linkCode) => { dispatch(startVerify(userId, linkCode)); }
  };
}

const ActiveVerify = connect(
  mapStateToProps,
  mapDispatchToProps
)(Verify);

const App = () => {
  return (
    <Router history={browserHistory}>
      <Route path="/" component={Main}>
        <IndexRoute component={Home} />
        <Route path="settings" component={Settings} />
        <Route path="verify/:userId/:linkCode" component={ActiveVerify} />
      </Route>
    </Router>
  );
}

export default App;