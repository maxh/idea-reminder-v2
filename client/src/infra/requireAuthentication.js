import React from 'react';  
import {connect} from 'react-redux';  
import { push } from 'react-router-redux'

export function requireAuth(Component) {

  class AuthenticatedComponent extends React.Component {

    componentWillMount() {
      this.checkAuth()
    }

    componentWillReceiveProps(nextProps) {
      this.checkAuth()
    }

    checkAuth() {
      if (!this.props.googleUser.current) {
        const redirectAfterLogin = this.props.location.pathname
        this.props.dispatch(push(`/sign-in?next=${redirectAfterLogin}`))
      }
    }

    render() {
      return (
        <div>
          {this.props.googleUser.current
            ? <Component />
            : null
          }
        </div>
      )

    }
  }

  const mapStateToProps = (state) => ({
    googleUser: state.googleUser
  })

  return connect(mapStateToProps)(AuthenticatedComponent)
}