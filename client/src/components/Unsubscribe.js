import React from 'react';
import { connect } from 'react-redux';
import { startUnsubscribe } from '../actions/index.js';


class StaticUnsubscribe extends React.Component {
  constructor(props) {
    super(props);
    this.props.startUnsubscribe();
  }

  render() {
    if (this.props.unsubscribe.isLoading) {
      return <div>Unsubscribing...</div>;
    } else if (this.props.unsubscribe.error) {
      return <div>{this.props.unsubscribe.error}</div>;
    } else {
      return (
        <div>
          Successfully unsubscribed.
        </div>
      );
    }
  }
}

export default connect(
  (state) => ({unsubscribe: state.unsubscribe}),
  {startUnsubscribe: startUnsubscribe}
)(StaticUnsubscribe);
