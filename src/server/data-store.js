import { FileStore } from 'fs-store';
import fs from 'fs';

const dataDir = 'data';

export default (proxyConfigs) => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  const mockStore = new FileStore(`${dataDir}/mock-store.json`);
  const logStore = proxyConfigs.reduce((logStoreAcc, proxyConfig) => ({ ...logStoreAcc, [proxyConfig.port]: [] }), {});

  const logResponse = ({
    proxyId,
    url,
    responseBody,
    client,
    httpMethod,
    contentType,
  }) => {
    const loggedResponse = {
      url,
      prettyResponseBody: responseBody, // TODO cleanup
      responseBody,
      client,
      timestamp: new Date(),
      httpMethod,
      contentType,
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

  const mockResponse = (proxyId, url, responseBody, httpMethod, contentType) => {
    const proxyMocks = mockStore.get(proxyId) || {};
    const mockedResponse = {
      url,
      responseBody,
      timestamp: new Date(),
      mockHasBeenServedRecently: false,
      httpMethod,
      contentType,
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
