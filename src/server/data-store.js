import { FileStore } from 'fs-store';
import winston from 'winston';

export default () => {
  const mockStore = new FileStore('data/mock-store.json');
  const logStore = [];

  const prettyResponseBody = (responseBody) => {
    try {
      return JSON.stringify(JSON.parse(responseBody), null, 2);
    } catch (err) {
      winston.warn('Unable to parse response body');
      return responseBody;
    }
  };

  const logResponse = (url, responseBody, client) => {
    const loggedResponse = Object.assign({}, logStore[url], {
      url,
      prettyResponseBody: prettyResponseBody(responseBody),
      responseBody,
      client,
      timestamp: new Date(),
    });
    logStore.unshift(loggedResponse);
    return loggedResponse;
  };

  const deleteMock = (url) => {
    const store = mockStore.getStore();
    delete store[url];
    mockStore.save();
  };

  const mockResponse = (url, responseBody) => {
    const mockedResponse = {
      url,
      responseBody,
      timestamp: new Date(),
      mockHasBeenServedRecently: false,
    };
    mockStore.set(url, mockedResponse);
    return mockedResponse;
  };

  const getMock = (url) => mockStore.get(url);

  const getLogList = () => logStore;

  const getMockList = () => Object.values(mockStore.getStore());

  return Object.freeze({
    logResponse,
    deleteMock,
    mockResponse,
    getLogList,
    getMockList,
    getMock,
  });
};
