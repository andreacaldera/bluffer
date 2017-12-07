import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';

import TopMenu from './TopMenu';

import meta from '../modules/meta';

import metaActions from '../modules/meta/actions';


class App extends Component {
  static propTypes = {
    route: PropTypes.shape().isRequired,
    closeInfo: PropTypes.func.isRequired,
    closeError: PropTypes.func.isRequired,
    info: PropTypes.string,
    error: PropTypes.string,
  };

  static defaultProps = {
    info: null,
    error: null,
  };

  render() {
    const {
      route,
      info,
      error,
      closeInfo,
      closeError,
    } = this.props;

    return (
      <div>
        <TopMenu />
        <div className="container">
          {info && (
            <div className="alert alert-info">
              {info}
              <a href="/close-info" onClick={closeInfo} className="float-right"><i className="fa fa-close fa-lg" /></a>
            </div>
          )}
          {error && (
            <div className="alert alert-danger">
              {error}
              <a href="/close-info" onClick={closeError} className="float-right"><i className="fa fa-close fa-lg" /></a>
            </div>
          )}
          {renderRoutes(route.routes)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  info: meta.getInfo(state),
  error: meta.getError(state),
});

export default connect(mapStateToProps, metaActions)(App);
