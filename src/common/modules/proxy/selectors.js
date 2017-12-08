import { createSelector } from 'reselect';

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

module.exports = {
  getSelectedProxy,
  getConfig,
  getLogList,
  getLogs,
};
