import { createSelector } from 'reselect';

import { getUiSelector } from '../selectors';

const getHasReachedPageBottom = createSelector(
  getUiSelector,
  ({ hasReachedPageBottom }) => hasReachedPageBottom
);

const getHasPassedHeightThreshold = createSelector(
  getUiSelector,
  ({ hasPassedHeightThreshold }) => hasPassedHeightThreshold
);

module.exports = {
  getHasReachedPageBottom,
  getHasPassedHeightThreshold,
};
