import { createSelector } from 'reselect';
import { NAMESPACE } from './constants';

const getRootSelector = (state) => state[NAMESPACE];

const getMetaSelector = createSelector(
  getRootSelector,
  ({ meta }) => meta
);

const getProxySelector = createSelector(
  getRootSelector,
  ({ proxy }) => proxy
);

const getUiSelector = createSelector(
  getRootSelector,
  ({ ui }) => ui
);

module.exports = {
  getRootSelector,
  getMetaSelector,
  getProxySelector,
  getUiSelector,
};
