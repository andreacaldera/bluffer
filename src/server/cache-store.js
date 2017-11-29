import _ from 'lodash';

export default () => {
  const cache = {};

  const setCachedResponse = (url, cachedResponse) => {
    const response = Object.assign({}, cache[url], {
      cachedResponse,
      timestamp: new Date(),
    });

    cache[url] = response;
    return response;
  };

  const deleteResponse = (url) => {
    delete cache[url];
  };

  const setSavedResponse = (url, savedResponse) => {
    const response = Object.assign({}, cache[url], { savedResponse });
    cache[url] = response;
    return response;
  };

  const getSavedResponse = (url) => _.get(cache, [url, 'savedResponse']);

  const getCachedResponse = (url) => _.get(cache, [url, 'cachedResponse']);

  const getResponse = (url) => getSavedResponse(url) || getCachedResponse(url);

  const all = () => cache;

  return Object.freeze({
    getResponse,
    setCachedResponse,
    setSavedResponse,
    all,
    getSavedResponse,
    getCachedResponse,
    deleteResponse,
  });
};
