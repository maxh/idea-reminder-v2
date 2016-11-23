import React from 'react';

import { connect } from 'react-redux';

import { Button } from 'react-bootstrap';

import { startSignIn, pushPath } from '../actions/index';


class SignInButtonBase extends React.Component {

  render() {
    if (this.props.authLib.isLoading) {
      return null;
    } else if (this.props.authLib.error) {
      return <div className="error">{this.props.authLib.error}</div>;
    } else if (this.props.googleUser.current) {
      return (
        <div>
          <span className="glyphicon glyphicon-ok"></span>
          Welcome, {this.props.googleUser.current.profileObj.name}.
        </div>
      );
    } else {
      return (
        <Button
            onClick={this.props.startSignIn}
            disabled={this.props.googleUser.isLoading}>
          Sign in with Google
        </Button>
      )
    }
  }
}

export const SignInButton = connect(
  state => ({googleUser: state.googleUser, authLib: state.authLib, account: state.account}),
  {startSignIn: startSignIn}
)(SignInButtonBase);



class SignInBase extends React.Component {

  componentWillMount() {
    this.checkAuth(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.checkAuth(nextProps)
  }

  checkAuth(props) {
    if (props.googleUser.current && props.account.current) {
      const next = this.props.location.query.next || '/';
      this.props.pushPath(next);
    }
  }

  render() {
    return (
      <div className="content">
        <div className="explanation">Please sign in to continue</div>
        <SignInButton />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  googleUser: state.googleUser,
  account: state.account
})

export default connect(
  mapStateToProps,
  {startSignIn: startSignIn,
    pushPath: pushPath}
)(SignInBase)
