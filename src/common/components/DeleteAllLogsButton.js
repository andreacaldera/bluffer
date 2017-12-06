import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import testClass from '../testClass';
import proxyModule from '../modules/proxy';

import proxyActions from '../modules/proxy/actions';

class DeleteAllLogsButton extends Component {
  static propTypes = {
    logList: PropTypes.arrayOf(PropTypes.shape().isRequired),
    deleteAllLogs: PropTypes.func.isRequired,
  };

  render() {
    const { logList, deleteAllLogs } = this.props;

    if (isEmpty(logList)) {
      return null;
    }


    return (
      <button
        onClick={deleteAllLogs}
        className={`btn btn-primary btn-danger delete-all-button float-right ${testClass(
          'clearLog',
        )}`}
        alt="delete"
      >
        Clear log
      </button>
    );
  }
}

const mapStateToProps = state => ({
  hasMocks: proxyModule.hasMocks(state),
});

export default connect(mapStateToProps, proxyActions)(DeleteAllLogsButton);
