import React from 'react';

import StripeCheckout from 'react-stripe-checkout';

import { Button, FormControl, FormGroup, InputGroup } from 'react-bootstrap';



class Donate extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {value: 10};
  }

  render() {
    return (
      <div className="content">
        Your support helps us cover server costs. Thanks!
        <FormGroup>
          <InputGroup>
            <InputGroup.Addon>$</InputGroup.Addon>
            <FormControl
              type="text"
              value={this.state.value}
              placeholder="Enter text"
              onChange={this.handleChange}
            />
          </InputGroup>
        </FormGroup>

        <StripeCheckout
          token={this.onToken}
          name="Idea Reminder Donation"
          description="Max Heinritz (maintainer)"
          stripeKey="pk_live_IQihi51uVchF400Gg5ndb99G"
          amount={this.state.value * 100}
          panelLabel="Donate"
          currency="USD">
          <Button>
            Donate with card
          </Button>
        </StripeCheckout>
      </div>
    );
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  onToken() {

  }
}

export default Donate;