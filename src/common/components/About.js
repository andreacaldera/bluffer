import React from 'react';
import { connect } from 'react-redux';

const About = () => (
  <div>
    <h1>About</h1>
    <p>Welcome to Bluffer, a proxy mock thingy</p>
  </div>
);

export default connect(null, null)(About);
