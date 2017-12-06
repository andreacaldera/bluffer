import { createSelector } from 'reselect';
import { isEmpty } from 'lodash';

import { getProxySelector } from '../selectors';

const getLogs = createSelector(
  getProxySelector,
  ({ logs }) => logs
);

const getConfig = createSelector(
  getProxySelector,
  ({ config }) => config
);

const getSelectedProxy = createSelector(
  getProxySelector,
  ({ selectedProxy }) => selectedProxy
);

const getLogList = createSelector(
  [getLogs, getSelectedProxy],
  (logs, selectedProxy) => logs[selectedProxy]
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
  getSelectedProxy,
  getConfig,
  getLogList,
  getLogs,
  getMockList,
  hasMocks,
};
