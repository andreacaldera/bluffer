import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import Log from './Log';

import proxyModule from '../modules/proxy';
import { SET_PROXY_RESPONSE, SELECT_PROXY_RESPONSE_URL, DELETE_PROXY_RESPONSE } from '../modules/proxy/constants';

class Proxy extends Component {
  static propTypes = {
    logList: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
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
    const { logList } = this.props;

    return (
      <div>
        <h1>Proxy</h1>

        { isEmpty(logList) && <p>No responses caught yet.</p>}

        <ul className="list-group form-group">
          {logList.map((log) => (<Log key={log.url} {...log} />))}
        </ul>

      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  logList: proxyModule.getLogList(state),
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
