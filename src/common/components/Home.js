import React, { Component } from 'react';
import ProxySelector from './ProxySelector';

export default class Home extends Component {
  render() {
    return (
      <div className="card">
        <ProxySelector preselected={false} />
        <div className="card-block">
          Please select a proxy
        </div>
      </div>
    );
  }
}
