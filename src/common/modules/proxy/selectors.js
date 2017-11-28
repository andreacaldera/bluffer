import { createSelector } from 'reselect';

import { getProxySelector } from '../selectors';

const getAll = createSelector(
  getProxySelector,
  ({ all }) => all
);

const getSelectedUrl = createSelector(
  getProxySelector,
  ({ selectedUrl }) => selectedUrl
);

const getSelected = createSelector(
  [getSelectedUrl, getAll],
  (selectedUrl, all) => {
    const selectedResponse = all[selectedUrl];
    if (!selectedResponse) {
      return null;
    }
    try {
      const prettyResponse = JSON.stringify(JSON.parse(selectedResponse.cachedResponse), null, 2);
      return Object.assign({}, selectedResponse, { prettyResponse });
    } catch (err) {
      return selectedResponse;
    }
  }
);

module.exports = {
  getAll,
  getSelectedUrl,
  getSelected,
};
