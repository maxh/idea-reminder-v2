import React from 'react';
import { connect } from 'react-redux';
import { startList } from '../actions/index';
import { Button, Pagination } from 'react-bootstrap';

import Spinner from './Spinner';


const isEmpty = (object) => {
  return Object.keys(object).length === 0;
}

class StaticList extends React.Component {
  constructor(props) {
    super(props);
    this.startDownloadCsv = this.startDownloadCsv.bind(this);
  }

  componentDidMount() {
    this.props.startList()
  }

  render() {
    var message;
    var ideas = this.props.ideas.ideas;
    if (this.props.ideas.isLoading) {
      return <Spinner />;;
    } else if (ideas && isEmpty(ideas)) {
      message = 'No ideas yet!';
    } else if (ideas) {
      message = this.renderIdeas(ideas);
    } else {
      message = this.props.error || 'Unable to list ideas.';
    }
    return (
      <div>{message}</div>
    );
  }

  renderIdeas(ideas) {
    const last = this.props.ideas.links.last;
    const maxPage = last && parseInt(last.split('=')[1], 10);
    return (
      <div>
        <div className="ideas">
          {ideas.map(this.renderIdea)}
        </div>
        {last && maxPage > 1 &&
          <div>
            <Pagination
              boundaryLinks
              items={maxPage}
              maxButtons={5}
              activePage={this.props.ideas.currentPage}
              onSelect={this.props.startList} />
          </div>
        }
        <Button style={{'marginTop': '20px'}} onClick={this.startDownloadCsv}>
          Download CSV {last && maxPage > 1 && '(all responses)'}
        </Button>
      </div>
    );
  }

  renderIdea(idea, i) {
    return (
      <div style={{'display': 'flex'}} key={i}>
        <div className="date" style={{'marginRight': '10px', 'flexShrink': 0}}>{idea.date}</div>
        <div style={{'wordWrap': 'break-word'}}>{idea.text}</div>
      </div>
    );
  }

  startDownloadCsv() {
    const fetchOptions = {
      method: 'GET',
      headers: new Headers()
    };
    const currentGoogleUser = this.props.googleUser.current;
    const tokenId = currentGoogleUser && currentGoogleUser.tokenId;
    fetchOptions.headers.set('X-IdeaReminder-Auth-Token-ID', tokenId);
    return fetch('/api/responses?format=csv', fetchOptions)
      .then(response => { return response.blob() })
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'idea-reminder-responses.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
  }
}

const mapStateToProps = (state) => {
  return {
    googleUser: state.googleUser,
    ideas: state.ideas
  };
}

export default connect(
  mapStateToProps,
  {startList: startList}
)(StaticList);