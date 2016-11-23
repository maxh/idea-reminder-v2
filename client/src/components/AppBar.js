import firebase from 'firebase/firebase-browser';
import React from 'react';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { startSignOut, startSignIn } from '../actions/index';

class UserNavItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.googleUser.isFetching) {
      // Loading.
      return <NavItem>Loading</NavItem>;
    } else if (this.props.googleUser.current) {
      // Signed in.
      return ;
    } else {
      // Not signed in.
      return false;
    }
  }
}


class AppBar extends React.Component {
  constructor(props) {
    super(props)
    this.setExpanded = this.setExpanded.bind(this);
    this.state = {expanded: false};
  }

  render() {
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
          {this.props.googleUser.current &&
            <Nav pullRight>
            <LinkContainer to="/unsubscribe">
              <NavItem>Unsubscribe</NavItem>
            </LinkContainer>
            <LinkContainer to="/list">
              <NavItem>Responses</NavItem>
            </LinkContainer>
              <NavItem onClick={this.props.startSignOut}>Sign out</NavItem>
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
    googleUser: state.googleUser
  }
}, {
  startSignIn: startSignIn,
  startSignOut: startSignOut
}, null, {pure: false})(AppBar);

