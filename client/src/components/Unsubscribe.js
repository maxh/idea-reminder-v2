import React from 'react';
import { connect } from 'react-redux';
import { startUnsubscribe } from '../actions/index.js';


class StaticUnsubscribe extends React.Component {
  componentWillMount() {
    this.props.startUnsubscribe();
  }

  render() {
    if (this.props.isLoading) {
      return <div>Unsubscribing...</div>;
    } else if (this.props.errorMessage) {
      return <div>{this.props.errorMessage || 'Unable to list email address.'}</div>
    } else {
      return (
        <div>
          <div>
            {'Successfully unsubscribed ' + this.props.user.email}
          </div>
          <div>
            You can delete your account on the settings page.
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return state.user;
}

export default connect(
  mapStateToProps,
  {startUnsubscribe: startUnsubscribe}
)(StaticUnsubscribe);