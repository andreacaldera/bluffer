import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import testClass from '../testClass';

import proxyActions from '../modules/proxy/actions';

class DeleteAllMocksButton extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    deleteAllMocks: PropTypes.func.isRequired,
  };

  static defaultProps = {
    disabled: false,
  }

  render() {
    const { disabled, deleteAllMocks } = this.props;

    return !disabled && (
      <button
        onClick={() => deleteAllMocks()}
        className={`btn btn-primary btn-danger float-right delete-all-button ${testClass('clearMocks')}`}
        alt="delete"
      >
        Clear mocks
      </button>
    );
  }
}

export default connect(null, proxyActions)(DeleteAllMocksButton);
