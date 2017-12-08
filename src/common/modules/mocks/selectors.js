import { createSelector } from 'reselect';
import { isEmpty } from 'lodash';

import { getMocksSelector, getProxySelector } from '../selectors';

const getSelectedProxy = createSelector(
  getProxySelector,
  ({ selectedProxy }) => selectedProxy
);

const getMocks = createSelector(
  getMocksSelector,
  ({ mocks }) => mocks
);

const getMockList = createSelector(
  [getMocks, getSelectedProxy],
  (mocks, selectedProxy) => Object.values(mocks[selectedProxy] || {})
);

const getActiveMocks = createSelector(
  getMocksSelector,
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
  getMocks,
  getMockList,
  hasMocks,
  getSelectedProxyActiveMocks,
};
