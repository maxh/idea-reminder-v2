import React from 'react';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { startSignOut, startSignIn } from '../actions/index';


class AppBar extends React.Component {
  constructor(props) {
    super(props)
    this.setExpanded = this.setExpanded.bind(this);
    this.state = {expanded: false};
  }

  render() {
    const signedIn = Boolean(this.props.googleUser.current);
    const libLoading = this.props.authLib.isLoading;
    const userLoading = this.props.googleUser.isLoading;
    const error = this.props.authLib.error;
    const ready = !(signedIn || libLoading || error);
    return (
      <Navbar fixedTop={true} collapseOnSelect={true}
              expanded={this.state.expanded}
              onToggle={this.setExpanded}>
        <Navbar.Header>
          <Navbar.Brand>
            <IndexLink to="/">Idea Reminder</IndexLink>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>

          {signedIn &&
            <Nav pullRight>
              <LinkContainer to="/donate">
                <NavItem>Donate</NavItem>
              </LinkContainer>
              <LinkContainer to="/responses">
                <NavItem>Responses</NavItem>
              </LinkContainer>
              <LinkContainer to="/settings">
                <NavItem>Settings</NavItem>
              </LinkContainer>
              <NavItem onClick={this.props.startSignOut}>Sign out</NavItem>
            </Nav>
          }

          {!signedIn &&
            <Nav pullRight>
              <LinkContainer to="/donate">
                <NavItem>Donate</NavItem>
              </LinkContainer>
              <NavItem onClick={this.props.startSignIn}>Sign in</NavItem>
            </Nav>
          }

        </Navbar.Collapse>
      </Navbar>
    );
  }

  setExpanded(value) {
    this.setState({expanded: value});
  }
}


// For context on {pure: false}, see:
// github.com/react-bootstrap/react-router-bootstrap/issues/152
export default connect((state) => {
  return {
    googleUser: state.googleUser,
    authLib: state.authLib
  }
}, {
  startSignIn: startSignIn,
  startSignOut: startSignOut
}, null, {pure: false})(AppBar);

