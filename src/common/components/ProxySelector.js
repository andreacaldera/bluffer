import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import proxyModule from '../modules/proxy';

import proxyActions from '../modules/proxy/actions';
import metaActions from '../modules/meta/actions';

class ProxySelector extends Component {
  static propTypes = {
    preselected: PropTypes.bool,
    config: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
    selectedProxyId: PropTypes.string,
    changeSelectedProxy: PropTypes.func.isRequired,
    changeRoute: PropTypes.func.isRequired,
  };

  static defaultProps = {
    preselected: true,
    selectedProxyId: null,
  }

  changeSelectedProxy = (proxyId) => (e) => {
    e.preventDefault();
    this.props.changeRoute(`/proxy/${proxyId}`, 'proxy');
  }

  render() {
    const { config, selectedProxyId, preselected } = this.props;

    return (
      <div className="card-header">
        <ul className="nav nav-pills card-header-pills">
          {config.map((proxyConfig) =>
            (
              <li
                role="presentation"
                className="nav-item"
                key={proxyConfig.port}
                onKeyPress={this.changeSelectedProxy(proxyConfig.port)}
                onClick={this.changeSelectedProxy(proxyConfig.port)}
              >
                <a className={`nav-link ${preselected && selectedProxyId === String(proxyConfig.port) ? 'active' : ''}`} href={`/proxy/${proxyConfig.port}`}>{proxyConfig.name}</a>
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  config: proxyModule.getConfig(state),
  selectedProxyId: proxyModule.getSelectedProxyId(state),
});

export default connect(mapStateToProps, { ...proxyActions, changeRoute: metaActions.changeRoute })(ProxySelector);
