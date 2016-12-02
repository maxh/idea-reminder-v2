import React from 'react';
import { connect } from 'react-redux';
import { startUnsubscribe } from '../actions/index.js';


class StaticUnsubscribe extends React.Component {
  componentDidMount() {
    this.props.startUnsubscribe();
  }

  render() {
    if (this.props.account.isLoading) {
      return <div>Unsubscribing...</div>;
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
  (state) => ({account: state.account}),
  {startUnsubscribe: startUnsubscribe}
)(StaticUnsubscribe);
