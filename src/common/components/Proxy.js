import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { isEmpty } from 'lodash';

import proxyModule from '../modules/proxy';
import { SET_PROXY_RESPONSE, SELECT_PROXY_RESPONSE_URL, DELETE_PROXY_RESPONSE } from '../modules/proxy/constants';

class Proxy extends Component {
  static propTypes = {
    selectedResponse: PropTypes.shape(),
    selectedUrl: PropTypes.string,
    responses: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
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

        { isEmpty(responses) && <p>No responses caugh yet.</p>}

        <ul className="list-group form-group row">
          {responses.map((response) => {
            if (selectedUrl && selectedUrl !== response.url) {
              return null;
            }
            const status = response.savedResponse ? 'Overwritten' : 'Normal';
            const statusClass = response.savedResponse ? 'badge-warning' : 'badge-success';
            const dateTime = response.timestamp ? moment(response.timestamp).format('MMM Do YYYY, HH:mm:ss') : null;

            return (
              <li className="list-group-item Response" key={response.url}>
                <div className="col-5" title={response.url}>{response.url}</div>
                <div className="col-3">{dateTime}</div>
                <div className={`col badge ${statusClass}`}>{status}</div>
                <div className="col-2">
                  <button className="float-right btn btn-primary ml-1" onClick={(e) => deleteResponse(e, response.url)}>Delete</button>
                  <button className="float-right btn btn-primary" onClick={(e) => selectResponse(e, response.url)}>Edit</button>
                </div>
              </li>
            );
          }
          )}
        </ul>

        {selectedResponse && (
          <div className="form-group mt-1">
            <div className="row">
              <textarea rows="10" className="col form-control" onChange={(e) => this.setState({ currentResponse: e.target.value })} value={currentResponse} />
            </div>
            <div className="row mt-1">
              <div className="col">
                <button className="btn btn-primary" onClick={(e) => saveResponse(e, selectedUrl, currentResponse)}>Save</button>
                <button className="btn btn-primary ml-1" onClick={(e) => cancelEditing(e)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  responses: proxyModule.getList(state),
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
