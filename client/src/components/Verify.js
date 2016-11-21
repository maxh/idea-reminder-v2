import React from 'react';
import { connect } from 'react-redux';
import { startVerify } from '../actions/index.js';


class StaticVerify extends React.Component {
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StaticVerify);