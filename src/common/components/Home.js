import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import uiModule from '../modules/ui';

const Home = ({ hasReachedPageBottom, hasPassedHeightThreshold }) =>
(<div>
  <h1>Home</h1>
  {hasReachedPageBottom && (<div className="home__bottom">You have reached the abyss of this page</div>)}
  {hasPassedHeightThreshold && (<div className="home__page-height-threshold">You passed the page threashold</div>)}
</div>);

Home.propTypes = {
  hasReachedPageBottom: PropTypes.bool.isRequired,
  hasPassedHeightThreshold: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  hasReachedPageBottom: uiModule.getHasReachedPageBottom(state),
  hasPassedHeightThreshold: uiModule.getHasPassedHeightThreshold(state),
});

export default connect(mapStateToProps, null)(Home);
