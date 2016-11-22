import React from 'react';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';


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
          <Nav pullRight>
            <LinkContainer to="/donate">
              <NavItem>Donate</NavItem>
            </LinkContainer>
            <NavDropdown eventKey={3} title="maxheinritz@gmail.com" id="basic-nav-dropdown">
              <LinkContainer to="/settings">
                <MenuItem>Settings</MenuItem>
              </LinkContainer>
              <LinkContainer to="/account">
                <MenuItem>Add password</MenuItem>
              </LinkContainer>
              <MenuItem divider />
              <LinkContainer to="/logout">
                <MenuItem>Logout</MenuItem>
              </LinkContainer>
          </NavDropdown>
          </Nav>
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
export default connect(null, null, null, {pure: false})(AppBar);

