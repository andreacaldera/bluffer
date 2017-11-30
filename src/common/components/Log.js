import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { string, func, instanceOf } from 'prop-types';

import { SET_PROXY_RESPONSE } from '../modules/proxy/constants';

class Log extends Component {
  static propTypes = {
    url: string.isRequired,
    timestamp: instanceOf(Date).isRequired,
    savedResponse: string,
    cachedResponse: string.isRequired,
    saveMockResponse: func.isRequired,
  };

  static defaultProps

  state = {
    isEditMode: false,
  };

  toggleMockForm = (e) => {
    e.preventDefault();
    this.setState({ isEditMode: !this.state.isEditMode });
  }

  saveMockResponse = (e) => {
    e.preventDefault();
    const { saveMockResponse, url } = this.props;
    saveMockResponse(url, this.textarea.value);
    this.setState({ isEditMode: false });
  }

  render() {
    const { url, timestamp, cachedResponse, savedResponse } = this.props;
    const { isEditMode } = this.state;
    const dateTime = moment(timestamp).format('MMM Do YYYY, HH:mm:ss');
    const statusClass = savedResponse ? 'badge-warning' : 'badge-success';
    const status = savedResponse ? 'Overwritten' : 'Normal';

    return (
      <li className="list-group-item" key={url}>
        <div className="row w-100">
          <div className="col-5" title={url}>{url}</div>
          <div className="col-3">{dateTime}</div>
          <div className={`col badge ${statusClass}`}>{status}</div>
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
              defaultValue={cachedResponse}
            />
          </div>,
          <div className="row mt-1 w-100">
            <div className="col">
              <button
                className="btn btn-primary"
                onClick={this.saveMockResponse}
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
  saveMockResponse: (url, response) => {
    dispatch({
      type: SET_PROXY_RESPONSE,
      payload: { url, response },
    });
  },
});

export default connect(null, mapDispatchToProps)(Log);

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
