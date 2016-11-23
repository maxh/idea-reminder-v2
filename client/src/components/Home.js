import React from 'react';
import { Button, Jumbotron } from 'react-bootstrap';
import { connect } from 'react-redux';
import { startSignIn } from '../actions/index';


class SubscribeForm extends React.Component {

  render() {
    if (this.props.googleUser.isLoading || this.props.authLib.isLoading) {
      return (
        <div className="success">
          Loading...
        </div>
      );
    } else if (this.props.googleUser.current) {
      return (
        <div className="success">
          <span className="glyphicon glyphicon-ok"></span>
          Welcome, {this.props.googleUser.current.profileObj.name}.
        </div>
      );
    } else {
      return (
        <Button onClick={this.props.startSignIn}>Sign in with Google</Button>
      );     
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    googleUser: state.googleUser,
    authLib: state.authLib
  };
}

const ActiveSubscribeForm = connect(
  mapStateToProps,
  {startSignIn: startSignIn}
)(SubscribeForm);


const Home = () => {
  return (
  	<div>
	    <Jumbotron>
	      <h2>Encourage a daily creative spark.</h2>
        <div className="subscribe-container">
	        <ActiveSubscribeForm />
        </div>
	    </Jumbotron>
	    <div className="how">
	    	<h3>How it works</h3>
		    <div className="steps">
					<div>
						<h3>1</h3>
					  Every day you'll receive an "Idea Reminder" email from us.
					</div>
					<div>
				  	<h3>2</h3>
					  Reply to the email with a short description of a new idea.
					</div>
					<div>
					  <h3>3</h3>
					  Your replies will be stored in a Google Spreadsheet visible only to you.
					 </div>
		    </div>
	    </div>
    </div>
  );
}

export default Home;
