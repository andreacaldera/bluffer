import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import testClass from '../testClass';

import proxyActions from '../modules/proxy/actions';

class DeleteAllLogsButton extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    deleteAllLogs: PropTypes.func.isRequired,
  };

  static defaultProps = {
    disabled: false,
  }

  render() {
    const { disabled, deleteAllLogs } = this.props;

    return !disabled && (
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

export default connect(null, proxyActions)(DeleteAllLogsButton);
