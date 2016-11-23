import React from 'react';

import { Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

import 'react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.min.css';
import Switch from 'react-bootstrap-switch';

import { loadAccount } from '../actions/index';

import { connect } from 'react-redux';



class Settings extends React.Component {

  componentDidMount() {
    this.props.loadAccount();
  }

  render() {
    const account = this.props.current
    return (
      <form className="content">
        <FormGroup controlId="reminder-enabled">
          <ControlLabel>Email reminders</ControlLabel>
          <div>
            <Switch 
                disabled={this.props.isLoading}
                bsSize="small" onColor="default"
                offColor="danger" value={account && account.isEnabled} />
          </div>
        </FormGroup>
        <FormGroup controlId="reminder-time">
          <ControlLabel>Reminder time</ControlLabel>
          <FormControl componentClass="select" defaultValue={'evening'}>
            <option value="morning">Morning (5am Pacific)</option>
            <option value="evening">Evening (5pm Pacific)</option>
          </FormControl>
        </FormGroup>
        <Button bsStyle="primary">
          Save changes
        </Button>
      </form>
    );
  }

}

export default connect(
  (state) => state.account,
  {loadAccount: loadAccount}
)(Settings);
