import firebase from 'firebase/firebase-browser';
import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { Nav, Navbar, NavItem } from 'react-bootstrap';


const startLogin = () => {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
}

const UserBox = (props) => {
  if (props.user.isFetching) {
    // Loading.
    return <div></div>;
  } else if (props.user.current) {
    // Signed in.
    return (
      <div>
        <div>{props.user.current.displayName}</div>
      </div>
    );      
  } else {
    // Not signed in.
    return (
      <div>
        <Button onClick={startLogin}>Get started</Button>
      </div>
    );      
  }
}

const UserBoxContainer = connect((state) => {
  return {
    user: state.user
  }
})(UserBox);

const AppBar = (props) => {
  return (
    <Navbar>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="/">Idea Reminder</a>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav pullRight>
          <NavItem eventKey={0} href="/settings">Settings</NavItem>
          <NavItem eventKey={1} href="#"><UserBoxContainer /></NavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default AppBar;

