import React from 'react';
import { connect } from 'react-redux';
import { startList } from '../actions/index';


class StaticList extends React.Component {
  componentWillMount() {
    var params = this.props.params;
    this.props.list(params.userId, params.linkCode);
  }

  render() {
    var message;
    if (this.props.isLoading) {
      message = 'Listing...';
    } else if (this.props.ideas) {
      message = this.renderIdeas(this.props.ideas);
    } else {
      message = this.props.errorMessage || 'Unable to list ideas.';
    }
    return (
      <div>{message}</div>
    );
  }

  renderIdeas(ideas) {
    return (
      <table className="ideas">
        <tbody>
          {this.props.ideas.map(this.renderIdea)}
        </tbody>
      </table>
    );
  }

  renderIdea(idea, i) {
    return (
      <tr key={i}>
        <td className="date">{idea.date.split('T')[0]}</td>
        <td>{idea.text}</td>
      </tr>
    );
  }
}

const mapStateToProps = (state) => {
  return state.ideas;
}
const mapDispatchToProps = (dispatch) => {
  return {
    list: (userId, linkCode) => { dispatch(startList(userId, linkCode)); }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StaticList);