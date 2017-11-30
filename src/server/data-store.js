
export default () => {
  const mockStore = {};
  const logStore = [];

  const logResponse = (url, responseBody) => {
    const loggedResponse = Object.assign({}, logStore[url], {
      responseBody,
      timestamp: new Date(),
      url,
    });
    logStore.unshift(loggedResponse);
    return loggedResponse;
  };

  const deleteMock = (url) => {
    delete mockStore[url];
  };

  const mockResponse = (url, response) => {
    const mockedResponse = {
      url,
      response,
      timestamp: new Date(),
    };
    mockStore[url] = mockedResponse;
    return mockedResponse;
  };

  const setMockResponseLastServed = (url) => {
    const mockedResponse = Object.assign({}, mockStore[url], {
      lastServed: new Date(),
    });
    mockedResponse[url] = mockedResponse;
    return mockedResponse;
  };

  // const getLog = (url) => logStore[url];

  const getMock = (url) => mockStore[url];

  const getLogList = () => logStore;

  const getMockList = () => Object.values(mockStore);

  return Object.freeze({
    logResponse,
    deleteMock,
    mockResponse,
    setMockResponseLastServed,
    getLogList,
    getMockList,
    getMock,
  });
};
