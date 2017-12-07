import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import proxyModule from '../modules/proxy';

const About = ({ proxyConfig }) => (
  <div>
    <h1>About</h1>
    <p>Welcome to Bluffer, a proxy mock thingy</p>
    <ul className="container list-group">
      {proxyConfig.map((config) => (
        <li key={config.port} className="row list-group-item">
          <div className="col">{config.name}</div>
          <div className="col">Listening on: {config.port}</div>
          <div className="col">Targetting: {config.target}</div>
        </li>
      ))}
    </ul>
  </div>
);

About.propTypes = {
  proxyConfig: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
};

const mapStateToProps = state => ({
  proxyConfig: proxyModule.getConfig(state),
});

export default connect(mapStateToProps, null)(About);
