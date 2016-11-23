import React from 'react';
import { connect } from 'react-redux';
import { startUnsubscribe } from '../actions/index.js';


class StaticUnsubscribe extends React.Component {
  componentWillMount() {
    this.props.startUnsubscribe();
  }

  render() {
    if (this.props.googleAccount) {
      return <div>Unsubscribing...</div>;
    } else if (this.props.errorMessage) {
      return <div>{this.props.errorMessage || 'Unable to list email address.'}</div>
    } else {
      return (
        <div>
          <div>
            Successfully unsubscribed.
          </div>
        </div>
      );
    }
  }
}

export default connect(
  null,
  {startUnsubscribe: startUnsubscribe}
)(StaticUnsubscribe);