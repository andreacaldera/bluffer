import { createSelector } from 'reselect';

import { getMetaSelector } from '../selectors';

const getFeatureToggles = createSelector(
  getMetaSelector,
  ({ featureToggles }) => featureToggles
);

const getActivePage = createSelector(
  getMetaSelector,
  ({ activePage }) => activePage
);

module.exports = {
  getActivePage,
  getFeatureToggles,
};
