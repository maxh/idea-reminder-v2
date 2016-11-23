import React from 'react';

import { connect } from 'react-redux';

import { Button } from 'react-bootstrap';

import { startSignIn, pushPath } from '../actions/index';


class SignInStatic extends React.Component {

  componentWillMount() {
    this.checkAuth(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.checkAuth(nextProps)
  }

  checkAuth(props) {
    if (props.googleUser.current) {
      const next = this.props.location.query.next || '/';
      this.props.pushPath(next);
    }
  }

  render() {
    return (
      <div className="content">
        <div className="explanation">Please sign in to contine</div>
        <Button onClick={this.props.startSignIn}>Sign in with Google</Button>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  googleUser: state.googleUser
})

export default connect(
  mapStateToProps,
  {startSignIn: startSignIn,
    pushPath: pushPath}
)(SignInStatic)
