import React from 'react';
import { connect } from 'react-redux';

const About = () =>
  (<div>
    <h1>About</h1>
    <p>This is a template web application</p>
  </div>);

export default connect(null, null)(About);
