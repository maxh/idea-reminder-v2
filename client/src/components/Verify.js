import React from 'react';
import { connect } from 'react-redux';
import { startVerify } from '../actions/index.js';


class StaticVerify extends React.Component {
  componentWillMount() {
    this.props.startVerify();
  }
  render() {
    var message;
    if (this.props.isLoading) {
      message = 'Verifying...';
    } else if (this.props.error) {
      message = this.props.error || 'Unable to verify email address.';
    } else if (this.props.user && this.props.user.email) {
      message = `The subscription for "${this.props.user.email}" has been verified. Thanks!`;
    }
    return (
      <div style={{'textAlign': 'center'}}>{message}</div>
    );
  }
}

const mapStateToProps = (state) => {
  const {user, error} = state;
  return {...user, error};
}

export default connect(
  mapStateToProps,
  {startVerify: startVerify}
)(StaticVerify);