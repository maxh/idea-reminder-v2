import React from 'react';
import { HelpBlock, FormGroup, Button, Form, Jumbotron, FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';
import { editEmail, startSubscribe } from '../actions/index';


class SubscribeForm extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    if (this.props.isDone) {
      return (
        <div className="success">
          <span className="glyphicon glyphicon-ok"></span>
          Welcome! Please click the verification link in the email we just sent.
        </div>
      );
    } else {
      return (
        <div>
          <Form inline>
            <FormGroup validationState={this.props.errorMessage ? 'error' : null}>
              <FormControl
                type="text"
                placeholder="Your email"
                disabled={this.props.isFetching}
                onChange={this.handleChange} />
              <Button
                type="submit"
                className="subscribe"
                disabled={this.props.isFetching}
                onClick={this.handleClick}>
                Subscribe
              </Button>
              <HelpBlock>{this.props.errorMessage}</HelpBlock>
            </FormGroup>
          </Form>
        </div>
      );     
    }

  }

  handleChange(event) {
    this.props.onChange(event.target.value);
  }

  handleClick() {
    this.props.onClick(this.props.email);
  }
}

const mapStateToProps = (state) => {
	return state.subscribe;
}
const mapDispatchToProps = (dispatch) => {
	return {
    onChange: (email) => { dispatch(editEmail(email)); },
		onClick: (email) => { dispatch(startSubscribe(email)); }
	};
}

const ActiveSubscribeForm = connect(
  mapStateToProps,
  mapDispatchToProps
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
					  Your replies will be stored for later and visible only to you.
					 </div>
		    </div>
	    </div>
    </div>
  );
}

export default Home;