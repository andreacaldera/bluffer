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

const getMocksSelector = createSelector(
  getRootSelector,
  ({ mocks }) => mocks
);

module.exports = {
  getRootSelector,
  getMetaSelector,
  getProxySelector,
  getMocksSelector,
};
