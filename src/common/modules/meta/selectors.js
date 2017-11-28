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

const getInfo = createSelector(
  getMetaSelector,
  ({ info }) => info
);

const getError = createSelector(
  getMetaSelector,
  ({ error }) => error
);

module.exports = {
  getActivePage,
  getFeatureToggles,
  getInfo,
  getError,
};
