import { FileStore } from 'fs-store';
import fs from 'fs';

const dataDir = 'data';

export default (proxyConfigs) => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  const mockResonseStore = new FileStore(`${dataDir}/mock-store.json`);
  const logResonseStore = proxyConfigs.reduce((logStoreAcc, proxyConfig) => ({ ...logStoreAcc, [proxyConfig.port]: [] }), {});

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
    logResonseStore[proxyId].unshift(loggedResponse);
    return loggedResponse;
  };

  const deleteMock = (proxyId, url) => {
    const proxyMocks = mockResonseStore.get(proxyId) || {};
    delete proxyMocks[url];
    mockResonseStore.set(proxyId, proxyMocks);
  };

  const deleteAllMocks = (proxyId) => {
    mockResonseStore.set(proxyId, {});
  };

  const mockResponse = (proxyId, url, responseBody, httpMethod, contentType) => {
    const proxyMocks = mockResonseStore.get(proxyId) || {};
    const mockedResponse = {
      url,
      responseBody,
      timestamp: new Date(),
      mockHasBeenServedRecently: false,
      httpMethod,
      contentType,
    };
    proxyMocks[url] = mockedResponse;
    mockResonseStore.set(proxyId, proxyMocks);
    return mockedResponse;
  };

  const getMock = (proxyId, url) => {
    const proxyMocks = mockResonseStore.get(proxyId);
    return proxyMocks && proxyMocks[url];
  };

  const deleteAllLogs = (proxyId) => {
    logResonseStore[proxyId] = [];
  };

  const getLogs = () => logResonseStore;

  const getMocks = () => mockResonseStore.getStore();

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
