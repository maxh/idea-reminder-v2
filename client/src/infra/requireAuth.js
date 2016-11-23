import React from 'react';  
import {connect} from 'react-redux';  
import { push } from 'react-router-redux'

export function requireAuth(Component, acceptLink = false) {

  class AuthenticatedComponent extends React.Component {

    componentWillMount() {
      this.checkAuth(this.props)
    }

    componentWillReceiveProps(nextProps) {
      this.checkAuth(nextProps)
    }

    checkAuth(props) {
      if (!props.authLib.isLoading && !props.googleUser.current) {
        if (acceptLink && props.location.query.linkCode) {
          return;  // A link code is enough for this component.
        }
        const nextPath = this.props.location.pathname
        this.props.dispatch(push(`/sign-in?next=${nextPath}`))
      }
    }

    hasValidAuth() {
      const isSignedIn = this.props.googleUser.current;
      const hasAcceptableLink = acceptLink && this.props.location.query.linkCode;
      return isSignedIn || hasAcceptableLink;
    }

    render() {
      return (
        <div>
          {this.hasValidAuth()
            ? <Component />
            : null
          }
        </div>
      )

    }
  }

  const mapStateToProps = (state) => ({
    authLib: state.authLib,
    googleUser: state.googleUser
  })

  return connect(mapStateToProps)(AuthenticatedComponent)
}
