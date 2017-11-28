import { createSelector } from 'reselect';

import { getProxySelector } from '../selectors';

const getAll = createSelector(
  getProxySelector,
  ({ all }) => all
);

module.exports = {
  getAll,
};
