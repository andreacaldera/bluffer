import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import moment from 'moment';
import Log from './Log';
import Mock from './Mock';

import proxyModule from '../modules/proxy';
import { DELETE_ALL_LOGS } from '../modules/proxy/constants';

class Home extends Component {
  static propTypes = {
    logList: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
    mockList: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
    deleteAllLogs: PropTypes.func.isRequired,
  };

  render() {
    const { logList, mockList } = this.props;

    const deleteAllLogsButton = !isEmpty(logList) &&
      <button onClick={this.props.deleteAllLogs} className="btn btn-primary btn-danger float-right" alt="delete">Clear log</button>;

    return (
      <div>
        {!isEmpty(mockList) && [
          <h2 key="mockTitle">Mocks</h2>,
          <ul key="mockList" className="list-group">
            {mockList.map((mock) => (<Mock key={`${mock.url}-${moment(mock.timestamp).valueOf()}`} {...mock} />))}
          </ul>,
        ]}

        <h2 className="mt-2">Response log
          {deleteAllLogsButton}
        </h2>
        {isEmpty(logList) && <p>No responses caught yet.</p>}

        {!isEmpty(logList) && (
          <div>
            <ul className="list-group form-group">
              {logList.map((log) => (<Log key={`${log.url}-${moment(log.timestamp).valueOf()}`} {...log} />))}
            </ul>
          </div>
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
  deleteAllLogs: (e) => {
    e.preventDefault();
    dispatch({
      type: DELETE_ALL_LOGS,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
