import { createSelector } from 'reselect';
import { isEmpty } from 'lodash';

import { getMocksSelector, getProxySelector } from '../selectors';

const getSelectedProxyId = createSelector(
  getProxySelector,
  ({ selectedProxyId }) => selectedProxyId
);

const getMocks = createSelector(
  getMocksSelector,
  ({ mocks }) => mocks
);

const getMockList = createSelector(
  [getMocks, getSelectedProxyId],
  (mocks, selectedProxy) => Object.values(mocks[selectedProxy] || {})
);

const getActiveMocks = createSelector(
  getMocksSelector,
  ({ activeMocks }) => activeMocks
);

const getSelectedProxyActiveMocks = createSelector(
  [getActiveMocks, getSelectedProxyId],
  (activeMocks, selectedProxy) => activeMocks[selectedProxy] || []
);

const hasMocks = createSelector(
  getMockList,
  (mockList) => !isEmpty(mockList)
);

module.exports = {
  getMocks,
  getMockList,
  hasMocks,
  getSelectedProxyActiveMocks,
};
