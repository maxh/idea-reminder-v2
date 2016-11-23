import React from 'react';
import { connect } from 'react-redux';
import { startList } from '../actions/index';


class StaticList extends React.Component {
  componentDidMount() {
    this.props.startList()
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

export default connect(
  mapStateToProps,
  {startList: startList}
)(StaticList);
