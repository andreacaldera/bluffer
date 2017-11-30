
export default () => {
  const mockStore = {};
  const logStore = {};

  const logResponse = (url, response) => {
    const loggedResponse = Object.assign({}, logStore[url], {
      response,
      timestamp: new Date(),
    });

    logStore[url] = loggedResponse;
    return response;
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

  const getLog = (url) => logStore[url];

  const getMock = (url) => mockStore[url];

  const getLogList = () => Object.values(logStore);

  const getMockList = () => Object.values(mockStore);

  return Object.freeze({
    logResponse,
    deleteMock,
    mockResponse,
    setMockResponseLastServed,
    getLogList,
    getMockList,
    getLog,
    getMock,
  });
};
