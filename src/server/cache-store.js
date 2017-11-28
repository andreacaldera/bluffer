import _ from 'lodash';

export default () => {
  const cache = {
    '/some-url': { cachedResponse: '{ "1": "one"}' },
    '/another-url': { cachedResponse: '{ "2": "two"}' },
  };

  const setCachedResponse = (url, cachedResponse) => {
    const response = cache[url];
    cache[url] = Object.assign({}, response, {
      cachedResponse,
      timestamp: new Date(),
    });
  };

  const setSavedResponse = (url, savedResponse) => {
    const response = cache[url];
    cache[url] = Object.assign({}, response, { savedResponse });
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
  });
};
