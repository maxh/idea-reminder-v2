import React from 'react';  
import {connect} from 'react-redux';  
import { push } from 'react-router-redux'

export function requireAuth(Component) {

  class AuthenticatedComponent extends React.Component {

    componentWillMount() {
      this.checkAuth(this.props)
    }

    componentWillReceiveProps(nextProps) {
      this.checkAuth(nextProps)
    }

    render() {
      return (
        <div>
          {this.hasValidAuth(this.props)
            ? <Component />
            : null
          }
        </div>
      )
    }

    checkAuth(props) {
      if (this.isAuthLoading(props)) return;
      if (this.hasValidAuth(props)) return;
      const nextPath = this.props.location.pathname
      this.props.dispatch(push(`/sign-in?next=${nextPath}`));
    }

    isAuthLoading(props) {
      return (
          props.authLib.isLoading ||
          props.account.isLoading ||
          props.googleUser.isLoading
      );
    }

    hasValidAuth(props) {
      return props.googleUser.current && props.account.current;
    }
  }

  const mapStateToProps = (state) => ({
    authLib: state.authLib,
    account: state.account,
    googleUser: state.googleUser
  })

  return connect(mapStateToProps)(AuthenticatedComponent)
}
