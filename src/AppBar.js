import firebase from 'firebase/firebase-browser';
import React from 'react';
import './AppBar.css';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';


class UserNavItem extends React.Component {
  constructor(props) {
    super(props);
    this.collapseParentMenu = this.props.setExpanded.bind(null, false);
    this.startLogin = this.startLogin.bind(this);
    this.startLogout = this.startLogout.bind(this);
  }

  render() {
    if (this.props.user.isFetching) {
      // Loading.
      return (
        <NavItem>
          Loading
        </NavItem>
      );
    } else if (this.props.user.current) {
      // Signed in.
      return (
        <NavItem onClick={this.startLogout}>
          Log out
        </NavItem>
      );      
    } else {
      // Not signed in.
      return (
        <NavItem onClick={this.startLogin}>Log in</NavItem>
      );      
    }
  }

  startLogin() {
    this.collapseParentMenu();
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  }

  startLogout() {
    this.collapseParentMenu();
    firebase.auth().signOut();
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
              onToggle={this.setExpanded}
              className={this.props.user.current && 'logged-in'}>
        <Navbar.Header>
          <Navbar.Brand>
            <IndexLink to="/">Idea Reminder</IndexLink>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <LinkContainer to="/donate">
              <NavItem>Donate</NavItem>
            </LinkContainer>
            <LinkContainer to="/settings">
              <NavItem className="settings">Settings</NavItem>
            </LinkContainer>
            <UserNavItem
                user={this.props.user}
                setExpanded={this.setExpanded}
                forceUpdate={Math.random()} />
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }

  setExpanded(value) {
    this.setState({expanded: value});
  }
}


export default connect((state) => {
  return {
    user: state.user
  }
})(AppBar);

