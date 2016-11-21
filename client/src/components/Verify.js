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
    if (this.props.isLoading) {
      message = 'Verifying...';
    } else if (this.props.user && this.props.user.email) {
      message = `The subscription for "${this.props.user.email}" has been verified. Thanks!`;
    } else {
      message = this.props.errorMessage || 'Unable to verify email address.';
    }
    return (
      <div style={{'textAlign': 'center'}}>{message}</div>
    );
  }
}

const mapStateToProps = (state) => {
  return state.user;
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