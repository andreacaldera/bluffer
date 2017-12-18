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

const getSelectedProxyId = createSelector(
  getProxySelector,
  ({ selectedProxyId }) => selectedProxyId
);

const getLogList = createSelector(
  [getLogs, getSelectedProxyId],
  (logs, selectedProxy) => logs[selectedProxy]
);

module.exports = {
  getSelectedProxyId,
  getConfig,
  getLogList,
  getLogs,
};
