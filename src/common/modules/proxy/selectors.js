import { createSelector } from 'reselect';

import { getProxySelector } from '../selectors';

const getLogList = createSelector(
  getProxySelector,
  ({ logList }) => logList
);

const getMockList = createSelector(
  getProxySelector,
  ({ mockList }) => mockList
);

module.exports = {
  getLogList,
  getMockList,
};
