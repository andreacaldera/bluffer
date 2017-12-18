import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import proxyModule from '../modules/proxy';
import metaActions from '../modules/meta/actions';
import proxyActions from '../modules/proxy/actions';

class About extends Component {
  static propTypes = {
    proxyConfig: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
    changeRoute: PropTypes.func.isRequired,
    changeSelectedProxy: PropTypes.func.isRequired,
  };

  navigateToProxy = (proxyId) => (e) => {
    e.preventDefault();
    this.props.changeRoute(`/proxy/${proxyId}`, 'proxy');
  }

  render() {
    const { proxyConfig } = this.props;

    return (
      <div>
        <h1>About</h1>
        <p>Welcome to Bluffer, a proxy mock thingy</p>
        <ul className="container list-group">
          {proxyConfig.map((config) => (
            <li key={config.port} className="row list-group-item">
              <div className="col">
                <button className="btn btn-primary select-proxy-button" onClick={this.navigateToProxy(config.port)} >
                  {config.name}
                </button>
              </div>
              <div className="col">Listening on: {config.port}</div>
              <div className="col">Targetting: {config.target}</div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  proxyConfig: proxyModule.getConfig(state),
});

export default connect(mapStateToProps, { ...metaActions, changeSelectedProxy: proxyActions.changeSelectedProxy })(About);
