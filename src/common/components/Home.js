import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import Log from './Log';
import Mock from './Mock';

import proxyModule from '../modules/proxy';
import { SET_PROXY_RESPONSE, SELECT_PROXY_RESPONSE_URL, DELETE_PROXY_RESPONSE } from '../modules/proxy/constants';

class Home extends Component {
  static propTypes = {
    logList: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
    mockList: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
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
    const { logList, mockList } = this.props;

    return (
      <div>
        <h1>Home</h1>

        {!isEmpty(mockList) && [
          <h2 key="mockTitle">Mocks</h2>,
          <ul key="mockList" className="list-group">
            {mockList.map((mock) => (<Mock key={`${mock.url}-${mock.timestamp}`} {...mock} />))}
          </ul>,
        ]}

        <h2 className="mt-2">Response log</h2>
        {isEmpty(logList) && <p>No responses caught yet.</p>}

        {!isEmpty(logList) && (
          <ul className="list-group form-group">
            {logList.map((log) => (<Log key={`${log.url}-${log.timestamp}`} {...log} />))}
          </ul>
        )}

      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  logList: proxyModule.getLogList(state),
  mockList: proxyModule.getMockList(state),
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
