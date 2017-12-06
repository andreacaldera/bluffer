import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import moment from 'moment';
import Log from './Log';
import Mock from './Mock';
import testClass from '../testClass';
import proxyModule from '../modules/proxy';

import proxyActions from '../modules/proxy/actions';

class Home extends Component {
  static propTypes = {
    logList: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
    mockList: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
    deleteAllLogs: PropTypes.func.isRequired,
    hasMocks: PropTypes.bool,
    deleteAllMocks: PropTypes.func.isRequired,
  };

  renderDeleteAllMocks() {
    const { hasMocks, mockList, deleteAllMocks } = this.props;

    if (!hasMocks) return null;

    return (
      <button
        onClick={() => deleteAllMocks(mockList)}
        className={`btn btn-primary btn-danger float-right delete-all-button ${testClass(
          'clearMocks',
        )}`}
        alt="delete"
      >
        Clear mocks
      </button>
    );
  }

  render() {
    const { logList, mockList } = this.props;

    const deleteAllLogsButton = !isEmpty(logList) && (
      <button
        onClick={this.props.deleteAllLogs}
        className={`btn btn-primary btn-danger delete-all-button float-right ${testClass(
          'clearLog',
        )}`}
        alt="delete"
      >
        Clear log
      </button>
    );

    return (
      <div>
        {!isEmpty(mockList) && [
          <h2 key="mockTitle">Mocks {this.renderDeleteAllMocks()}</h2>,
          <ul key="mockList" className={`list-group ${testClass('mockList')}`}>
            {mockList.map(mock => (
              <Mock
                key={`${mock.url}-${moment(mock.timestamp).valueOf()}`}
                {...mock}
              />
            ))}
          </ul>,
        ]}

        <h2 className="mt-2">
          Response log
          {deleteAllLogsButton}
        </h2>
        {isEmpty(logList) && <p>No responses caught yet.</p>}

        {!isEmpty(logList) && (
          <div>
            <ul
              className={`list-group form-group ${testClass('responseList')}`}
            >
              {logList.map(log => (
                <Log
                  key={`${log.url}-${moment(log.timestamp).valueOf()}`}
                  {...log}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  hasMocks: proxyModule.hasMocks(state),
  logList: proxyModule.getLogList(state),
  mockList: proxyModule.getMockList(state),
});

export default connect(mapStateToProps, proxyActions)(
  Home,
);
