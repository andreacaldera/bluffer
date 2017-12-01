import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { string, func, instanceOf, oneOfType, bool } from 'prop-types';

import { MOCK_RESPONSE, DELETE_MOCK } from '../modules/proxy/constants';

class Mock extends Component {
  static propTypes = {
    url: string.isRequired,
    responseBody: string.isRequired,
    timestamp: oneOfType([string, instanceOf(Date)]).isRequired,
    lastServed: oneOfType([string, instanceOf(Date)]),
    saveMockResponse: func.isRequired,
    mockHasBeenServedRecently: bool,
    deleteMock: func.isRequired,
  };

  static defaultProps = {
    mockHasBeenServedRecently: false,
  };

  state = {
    isEditMode: false,
  };

  toggleMockForm = (e) => {
    e.preventDefault();
    this.setState({ isEditMode: !this.state.isEditMode });
  }

  cancelEdit = (e) => {
    e.preventDefault();
    this.setState({ isEditMode: false });
    this.textarea.value = this.props.responseBody;
  }

  mockResponse = (e) => {
    e.preventDefault();
    const { saveMockResponse, url } = this.props;
    saveMockResponse(url, this.textarea.value);
    this.setState({ isEditMode: false });
  }

  deleteMock = (e) => {
    e.preventDefault();
    const { deleteMock, url } = this.props;
    deleteMock(url);
  }

  render() {
    const { url, timestamp, responseBody, mockHasBeenServedRecently } = this.props;
    const { isEditMode } = this.state;
    const dateTime = moment(timestamp).format('DD-MMM HH:mm:ss');
    const recentlyServedClass = mockHasBeenServedRecently ? 'recentlyServed' : '';

    return (
      <li className={`list-group-item form-group ${recentlyServedClass}`} key={url}>
        <div className="row w-100" onClick={this.toggleMockForm}>
          <div className="col-9 url" title={url}>{url}</div>
          <div className="col-3"><div className="float-right">{dateTime}</div></div>
        </div>
        {isEditMode && (
          <div className="mock-panel--details w-100">
            <div className="row"><div className="col">URL: {url}</div></div>
            <div className="row">
              <div className="col">
                <textarea
                  ref={(r) => { this.textarea = r; }}
                  rows="10"
                  className="col form-control"
                  defaultValue={responseBody}
                />
              </div>
            </div>
            <div className="row mt-1">
              <div className="col">
                <button
                  className="btn btn-primary"
                  onClick={this.mockResponse}
                >
                  Save
                </button>
                <button onClick={this.cancelEdit} className="ml-1 btn btn-primary" alt="cancel">Cancel</button>
                <button onClick={this.deleteMock} className="btn btn-primary btn-danger float-right" alt="delete">Remove</button>
              </div>
            </div>
          </div>
          )}
      </li>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  saveMockResponse: (url, responseBody) => {
    dispatch({
      type: MOCK_RESPONSE,
      payload: { url, responseBody },
    });
  },
  deleteMock: (url) => {
    dispatch({
      type: DELETE_MOCK,
      payload: url,
    });
  },
});

export default connect(null, mapDispatchToProps)(Mock);

// #2
//   if (selectedUrl && selectedUrl !== response.url) {
//     return null;
//   }
//   const status = response.savedResponse ? 'Overwritten' : 'Normal';
//   const statusClass = response.savedResponse ? 'badge-warning' : 'badge-success';
//   const dateTime = response.timestamp ? moment(response.timestamp).format('MMM Do YYYY, HH:mm:ss') : null;
//
//   return (
//     <li className="list-group-item Response" key={response.url}>
//       <div className="col-5" title={response.url}>{response.url}</div>
//       <div className="col-3">{dateTime}</div>
//       <div className={`col badge ${statusClass}`}>{status}</div>
//       <div className="col-2">
//         <button className="float-right btn btn-primary ml-1" onClick={(e) => deleteResponse(e, response.url)}>Delete</button>
//         <button className="float-right btn btn-primary" onClick={(e) => selectResponse(e, response.url)}>Edit</button>
//       </div>
//     </li>
//   );
// }
// )}

// {selectedResponse && (
//   <div className="form-group mt-1">
//     <div className="row">
//       <textarea rows="10" className="col form-control" onChange={(e) => this.setState({ currentResponse: e.target.value })} value={currentResponse} />
//     </div>
//     <div className="row mt-1">
//       <div className="col">
//         <button className="btn btn-primary" onClick={(e) => saveResponse(e, selectedUrl, currentResponse)}>Save</button>
//         <button className="btn btn-primary ml-1" onClick={(e) => cancelEditing(e)}>Cancel</button>
//       </div>
//     </div>
//   </div>
// )}
