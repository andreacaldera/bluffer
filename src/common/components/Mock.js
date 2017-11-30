import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { string, func, instanceOf, bool } from 'prop-types';

import { MOCK_RESPONSE } from '../modules/proxy/constants';

class Mock extends Component {
  static propTypes = {
    url: string.isRequired,
    responseBody: string.isRequired,
    timestamp: instanceOf(Date).isRequired,
    lastServed: instanceOf(Date),
    saveMockResponse: func.isRequired,
    mockHasBeenServedRecently: bool.isRequired,
  };

  static defaultProps

  state = {
    isEditMode: false,
  };

  toggleMockForm = (e) => {
    e.preventDefault();
    this.setState({ isEditMode: !this.state.isEditMode });
  }

  mockResponse = (e) => {
    e.preventDefault();
    const { saveMockResponse, url } = this.props;
    saveMockResponse(url, this.textarea.value);
    this.setState({ isEditMode: false });
  }

  render() {
    const { url, timestamp, responseBody, mockHasBeenServedRecently } = this.props;
    const { isEditMode } = this.state;
    const dateTime = moment(timestamp).format('MMM Do YYYY, HH:mm:ss');
    const recentlyServedClass = mockHasBeenServedRecently ? 'recentlyServed' : '';

    return (
      <li className={`list-group-item ${recentlyServedClass}`} key={url}>
        <div className="row w-100">
          <div className="col-5" title={url}>{url}</div>
          <div className="col-3">{dateTime}</div>
          <div className="col-2">
            <button className="float-right btn btn-primary" onClick={this.toggleMockForm}>
              {isEditMode ? 'Cancel' : 'Edit'}
            </button>
          </div>
        </div>
        {isEditMode && [
          <div className="form-group mt-1 row w-100">
            <textarea
              ref={(r) => {
                this.textarea = r;
              }}
              rows="10"
              className="col form-control"
              defaultValue={responseBody}
            />
          </div>,
          <div className="row mt-1 w-100">
            <div className="col">
              <button
                className="btn btn-primary"
                onClick={this.mockResponse}
              >
                Save
              </button>
            </div>
          </div>]}
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
