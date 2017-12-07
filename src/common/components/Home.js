import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import moment from 'moment';

import Log from './Log';
import Mock from './Mock';
import DeleteAllMocksButton from './DeleteAllMocksButton';
import DeleteAllLogsButton from './DeleteAllLogsButton';
import ProxySelector from './ProxySelector';

import testClass from '../testClass';
import proxyModule from '../modules/proxy';

import proxyActions from '../modules/proxy/actions';

class Home extends Component {
  static propTypes = {
    logList: PropTypes.arrayOf(PropTypes.shape().isRequired),
    mockList: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
    deleteAllLogs: PropTypes.func.isRequired,
    deleteAllMocks: PropTypes.func.isRequired,
    changeSelectedProxy: PropTypes.func.isRequired,
  };

  static defaultProps = {
    logList: null,
    selectedProxy: null,
  }

  changeSelectedProxy = (newPort) => (e) => {
    e.preventDefault();
    this.props.changeSelectedProxy(newPort);
  }

  render() {
    const { logList, mockList } = this.props;

    return (
      <div className="card">
        <ProxySelector />
        <div className="card-block">
          {!isEmpty(mockList) && [
            <h2 key="mockTitle">
              Mocks
              <DeleteAllMocksButton disabled={isEmpty(mockList)} />
            </h2>,
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
            <DeleteAllLogsButton disabled={isEmpty(logList)} />
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  logList: proxyModule.getLogList(state),
  mockList: proxyModule.getMockList(state),
});

export default connect(mapStateToProps, proxyActions)(
  Home,
);
