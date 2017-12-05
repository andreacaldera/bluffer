import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import moment from 'moment';
import Log from './Log';
import Mock from './Mock';
import testClass from '../testClass';
import proxyModule from '../modules/proxy';

import { deleteAllLogs } from '../actions/logs';
import { deleteAllMocks } from '../actions/mocks';

class Home extends Component {
  static propTypes = {
    logList: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
    mockList: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
    deleteAllLogs: PropTypes.func.isRequired,
    isMockListEmpty: PropTypes.bool,
    deleteAllMocks: PropTypes.func.isRequired,
  };

  renderDeleteAllMocks() {
    const { isMockListEmpty, deleteAllMocks, mockList } = this.props;

    if (isMockListEmpty) return null;

    return (
      <button
        onClick={() => deleteAllMocks(mockList)}
        className={`btn btn-primary btn-danger float-right ${testClass(
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
        className={`btn btn-primary btn-danger float-right ${testClass(
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

const mapStateToProps = state => {
  const mockList = proxyModule.getMockList(state);
  return {
    isMockListEmpty: isEmpty(mockList),
    logList: proxyModule.getLogList(state),
    mockList,
  };
};

export default connect(mapStateToProps, { deleteAllLogs, deleteAllMocks })(
  Home,
);
