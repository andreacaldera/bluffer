import { FileStore } from 'fs-store';
import winston from 'winston';
import fs from 'fs';

const dataDir = 'data';

// TODO remema all proxy / proxyPort to proxyId

export default (proxyConfigs) => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  const mockStore = new FileStore(`${dataDir}/mock-store.json`);
  const logStore = proxyConfigs.reduce((logStoreAcc, proxyConfig) => ({ ...logStoreAcc, [proxyConfig.port]: [] }), {});

  const prettyResponseBody = (responseBody) => {
    try {
      return JSON.stringify(JSON.parse(responseBody), null, 2);
    } catch (err) {
      winston.warn('Unable to parse response body', err);
      return responseBody;
    }
  };

  const logResponse = (proxyId, url, responseBody, client) => {
    const loggedResponse = {
      url,
      prettyResponseBody: prettyResponseBody(responseBody),
      responseBody,
      client,
      timestamp: new Date(),
    };
    logStore[proxyId].unshift(loggedResponse);
    return loggedResponse;
  };

  const deleteMock = (proxyId, url) => {
    const proxyMocks = mockStore.get(proxyId) || {};
    delete proxyMocks[url];
    mockStore.set(proxyId, proxyMocks);
  };

  const deleteAllMocks = (proxyId) => {
    mockStore.set(proxyId, {});
  };

  const mockResponse = (proxyId, url, responseBody) => {
    const proxyMocks = mockStore.get(proxyId) || {};
    const mockedResponse = {
      url,
      responseBody,
      timestamp: new Date(),
      mockHasBeenServedRecently: false,
    };
    proxyMocks[url] = mockedResponse;
    mockStore.set(proxyId, proxyMocks);
    return mockedResponse;
  };

  const getMock = (proxyId, url) => {
    const proxyMocks = mockStore.get(proxyId);
    return proxyMocks && proxyMocks[url];
  };

  const deleteAllLogs = (proxyId) => {
    logStore[proxyId] = [];
  };

  const getLogs = () => logStore;

  const getMocks = () => mockStore.getStore();

  return Object.freeze({
    logResponse,
    mockResponse,
    getLogs,
    getMocks,
    deleteMock,
    getMock,
    deleteAllLogs,
    deleteAllMocks,
  });
};
