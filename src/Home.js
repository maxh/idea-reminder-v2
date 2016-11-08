import React from 'react';
import { Button, Jumbotron } from 'react-bootstrap';
import './Home.css';

const Home = () => {
  return (
  	<div>
	    <Jumbotron>
	      <h2>Encourage a daily creative spark.</h2>
	      <p><Button>Get started</Button></p>
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
					  Your replies will be stored a Google Spreadsheet visible only to you.
					 </div>
		    </div>
	    </div>
    </div>
  );
}

export default Home;