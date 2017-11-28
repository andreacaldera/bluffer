import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';

import proxyModule from '../modules/proxy';
import { SET_PROXY_RESPONSE, SELECT_PROXY_RESPONSE_URL, DELETE_PROXY_RESPONSE } from '../modules/proxy/constants';

class Proxy extends Component {
  static propTypes = {
    selectedResponse: PropTypes.shape(),
    selectedUrl: PropTypes.string,
    responses: PropTypes.shape().isRequired,
    setResponse: PropTypes.func.isRequired,
    selectResponse: PropTypes.func.isRequired,
    cancelEditing: PropTypes.func.isRequired,
    deleteResponse: PropTypes.func.isRequired,
  };
  static defaultProps = {
    selectedResponse: null,
    selectedUrl: null,
  };

  state = {
    currentResponse: null,
  }

  componentWillReceiveProps({ selectedUrl, selectedResponse }) {
    if (!selectedUrl) {
      this.setState({ currentResponse: null });
    } else {
      this.setState({ currentResponse: selectedResponse.prettyResponse || selectedResponse.savedResponse || selectedResponse.cachedResponse });
    }
  }

  render() {
    const { setResponse, responses, selectResponse, selectedUrl, selectedResponse, cancelEditing, deleteResponse } = this.props;
    const { currentResponse } = this.state;
    const saveResponse = (e, url) => {
      setResponse(e, url, currentResponse);
      this.setState({ currentResponse: null });
    };

    return (
      <div>
        <h1>Proxy</h1>

        <ul className="list-group form-group">
          {Object.keys(responses).map((url) => {
            if (selectedUrl && selectedUrl !== url) {
              return null;
            }
            const response = responses[url];
            const status = response.savedResponse ? 'Overwritten' : 'Normal';
            const statusClass = response.savedResponse ? 'badge-warning' : 'badge-success';
            const dateTime = response.timestamp ? moment(response.timestamp).format('MMMM Do YYYY, h:mm:ss a') : null;

            return (
              <li className="list-group-item Response" key={url}>
                <div className="Response-url" title={url}>{url}</div>
                <div className="Response-dateTime">{dateTime}</div>
                <div className={`ml-auto badge ${statusClass}`}>{status}</div>
                <button className="btn btn-primary" onClick={(e) => setResponse(e, url)}>Use this response</button>
                <button className="btn btn-primary" onClick={(e) => selectResponse(e, url)}>Edit</button>
                <button className="btn btn-primary" onClick={(e) => deleteResponse(e, url)}>Delete</button>
              </li>
            );
          }
          )}
        </ul>

        {selectedResponse && (
          <div className="form-group">
            <textarea rows="10" className="form-control" onChange={(e) => this.setState({ currentResponse: e.target.value })} value={currentResponse} />
            <button className="btn btn-primary" onClick={(e) => saveResponse(e, selectedUrl, currentResponse)}>Save</button>
            <button className="btn btn-primary" onClick={(e) => cancelEditing(e)}>Cancel</button>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  responses: proxyModule.getAll(state),
  selectedResponse: proxyModule.getSelected(state),
  selectedUrl: proxyModule.getSelectedUrl(state),
});

const mapDispatchToProps = (dispatch) => ({
  setResponse: (e, url, response) => {
    e.preventDefault();
    dispatch({
      type: SET_PROXY_RESPONSE,
      payload: { url, response },
    });
  },
  selectResponse: (e, url) => {
    e.preventDefault();
    dispatch({
      type: SELECT_PROXY_RESPONSE_URL,
      payload: url,
    });
  },
  cancelEditing: (e) => {
    e.preventDefault();
    dispatch({
      type: SELECT_PROXY_RESPONSE_URL,
      payload: null,
    });
  },
  deleteResponse: (e, url) => {
    e.preventDefault();
    dispatch({
      type: DELETE_PROXY_RESPONSE,
      payload: url,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Proxy);
