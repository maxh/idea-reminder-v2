import React from 'react';
import { Jumbotron } from 'react-bootstrap';
import { SignInButton } from './SignIn';


const Home = () => {
  return (
  	<div>
	    <Jumbotron>
	      <h2>Encourage a daily creative spark.</h2>
        <div className="subscribe-container">
	        <SignInButton />
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
					  Your replies will be saved and visible only to you.
					 </div>
		    </div>
	    </div>
    </div>
  );
}

export default Home;
