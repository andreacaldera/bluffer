import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import testClass from '../testClass';
import proxyModule from '../modules/proxy';

import proxyActions from '../modules/proxy/actions';

class DeleteAllMocksButton extends Component {
  static propTypes = {
    hasMocks: PropTypes.bool.isRequired,
    deleteAllMocks: PropTypes.func.isRequired,
  };

  render() {
    const { hasMocks, deleteAllMocks } = this.props;

    if (!hasMocks) {
      return null;
    }

    return (
      <button
        onClick={() => deleteAllMocks()}
        className={`btn btn-primary btn-danger float-right delete-all-button ${testClass(
          'clearMocks',
        )}`}
        alt="delete"
      >
        Clear mocks
      </button>
    );
  }
}

const mapStateToProps = state => ({
  hasMocks: proxyModule.hasMocks(state),
});

export default connect(mapStateToProps, proxyActions)(DeleteAllMocksButton);
