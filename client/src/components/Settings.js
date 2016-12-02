import React from 'react';

import { Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

import 'react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.min.css';
import Switch from 'react-bootstrap-switch';

import { loadAccount, updateAccount } from '../actions/index';

import { connect } from 'react-redux';



class Settings extends React.Component {

  constructor(props) {
    super(props);
    this.onSwitchChange = this.onSwitchChange.bind(this);
    this.onTimeChange = this.onTimeChange.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.isSaveDisabled = this.isSaveDisabled.bind(this);
    this.state = {};
  }

  componentDidMount() {
    this.props.loadAccount();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      emailsEnabled: nextProps.current.emailsEnabled,
      timeOfDay: nextProps.current.timeOfDay
    });
  }

  render() {
    const account = this.state;
    return (
      <form className="content">
        <FormGroup controlId="reminder-enabled">
          <ControlLabel>Email reminders</ControlLabel>
          <div>
            <Switch 
                disabled={this.props.isLoading}
                bsSize="small"
                onColor="default"
                offColor="danger"
                value={account.emailsEnabled}
                onChange={this.onSwitchChange} />
          </div>
        </FormGroup>
        <FormGroup controlId="reminder-time">
          <ControlLabel>Reminder time</ControlLabel>
          <FormControl
              disabled={this.props.isLoading}
              componentClass="select"
              value={account.timeOfDay}
              onChange={this.onTimeChange}>
            <option value="morning">Morning (5am Pacific)</option>
            <option value="evening">Evening (5pm Pacific)</option>
          </FormControl>
        </FormGroup>
        <Button bsStyle="primary" onClick={this.saveChanges} disabled={this.isSaveDisabled()}>
          Save
        </Button>

      </form>
    );
  }

  isSaveDisabled() {
    return (
        this.props.isLoading ||
        (this.state.emailsEnabled === this.props.current.emailsEnabled &&
         this.state.timeOfDay === this.props.current.timeOfDay)
    );
  }

  onSwitchChange(el, state) {
    this.setState({emailsEnabled: state});
  }

  onTimeChange(el) {
    this.setState({timeOfDay: el.target.value});
  }

  saveChanges() {
    this.props.updateAccount(this.state);
  }
}

const mapStateToProps = (state) => {
  return state.account;
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadAccount: () => { dispatch(loadAccount()); },
    updateAccount: (account) => { dispatch(updateAccount(account)); }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
