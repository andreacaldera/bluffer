import { createSelector } from 'reselect';
import { isEmpty } from 'lodash';

import { getProxySelector } from '../selectors';

const getLogList = createSelector(
  getProxySelector,
  ({ logList }) => logList
);

const getMockList = createSelector(
  getProxySelector,
  ({ mockList }) => mockList
);

const hasMocks = createSelector(
  getMockList,
  (mockList) => !isEmpty(mockList)
);

module.exports = {
  getLogList,
  getMockList,
  hasMocks,
};
