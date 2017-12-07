import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import proxyModule from '../modules/proxy';

import proxyActions from '../modules/proxy/actions';
import metaActions from '../modules/meta/actions';

class Home extends Component {
  static propTypes = {
    config: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
    selectedProxy: PropTypes.number,
    changeSelectedProxy: PropTypes.func.isRequired,
    changeRoute: PropTypes.func.isRequired,
  };

  static defaultProps = {
    selectedProxy: null,
  }

  changeSelectedProxy = (proxyId) => (e) => {
    e.preventDefault();
    this.props.changeSelectedProxy(proxyId);
    this.props.changeRoute(`/proxy/${proxyId}`);
  }

  render() {
    const { config, selectedProxy } = this.props;

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
                <a className={`nav-link ${selectedProxy === proxyConfig.port ? 'active' : ''}`} href={`/proxy/${proxyConfig.port}`}>{proxyConfig.name}</a>
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
  selectedProxy: proxyModule.getSelectedProxy(state),
});

export default connect(mapStateToProps, { ...proxyActions, changeRoute: metaActions.changeRoute })(Home);
