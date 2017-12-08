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

const getMocks = createSelector(
  getProxySelector,
  ({ mocks }) => mocks
);

const getMockList = createSelector(
  [getMocks, getSelectedProxy],
  (mocks, selectedProxy) => Object.values(mocks[selectedProxy] || {})
);

const getActiveMocks = createSelector(
  getProxySelector,
  ({ activeMocks }) => activeMocks
);

const getSelectedProxyActiveMocks = createSelector(
  [getActiveMocks, getSelectedProxy],
  (activeMocks, selectedProxy) => activeMocks[selectedProxy] || []
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
  getMocks,
  getMockList,
  hasMocks,
  getSelectedProxyActiveMocks,
};
