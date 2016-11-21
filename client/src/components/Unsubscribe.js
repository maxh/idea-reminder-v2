import React from 'react';
import { connect } from 'react-redux';
import { startUnsubscribe } from '../actions/index.js';


class StaticUnsubscribe extends React.Component {
  componentWillMount() {
    var params = this.props.params;
    this.props.unsubscribe(params.userId, params.linkCode);
  }

  render() {
    if (this.props.isFetching) {
      return <div>Unsubscribing...</div>;
    } else if (this.props.errorMessage) {
      return <div>{this.props.errorMessage || 'Unable to list email address.'}</div>
    } else {
      return (
        <div>
          <div>
            {'Successfully unsubscribed ' + this.props.email}
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
  return state.unsubscribe;
}
const mapDispatchToProps = (dispatch) => {
  return {
    unsubscribe: (userId, linkCode) => {
      dispatch(startUnsubscribe(userId, linkCode));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StaticUnsubscribe);