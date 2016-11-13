import React from 'react';
import { HelpBlock, FormGroup, Button, Form, Jumbotron, FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';
import './Home.css';
import { editEmail, startSubscribe, SubscribeStatus } from '../../actions/index.js';


class SubscribeForm extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    if (this.props.status === SubscribeStatus.SUCCESS) {
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
            <FormGroup validationState={this.props.validationState}>
              <FormControl
                type="text"
                placeholder="Your email"
                disabled={this.props.disabled}
                onChange={this.handleChange} />
              <Button
                type="submit"
                className="subscribe"
                disabled={this.props.disabled}
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
  const status = state.subscribe.status;
	return {
		status: status,
    errorMessage: state.subscribe.errorMessage,
    email: state.subscribe.email,
    disabled: status === SubscribeStatus.LOAD,
    validationState: status === SubscribeStatus.FAILURE ? 'error' : null
	};
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
					  Your replies will be stored in a Google Spreadsheet visible only to you.
					 </div>
		    </div>
	    </div>
    </div>
  );
}

export default Home;