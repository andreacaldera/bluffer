
export default () => {
  const mockStore = {};
  const logStore = [];

  const logResponse = (url, responseBody) => {
    const loggedResponse = Object.assign({}, logStore[url], {
      url,
      responseBody,
      timestamp: new Date(),
    });
    logStore.unshift(loggedResponse);
    return loggedResponse;
  };

  const deleteMock = (url) => {
    delete mockStore[url];
  };

  const mockResponse = (url, responseBody) => {
    const mockedResponse = {
      url,
      responseBody,
      timestamp: new Date(),
      mockHasBeenServedRecently: false,
    };
    mockStore[url] = mockedResponse;
    return mockedResponse;
  };

  const getMock = (url) => mockStore[url];

  const getLogList = () => logStore;

  const getMockList = () => Object.values(mockStore);

  return Object.freeze({
    logResponse,
    deleteMock,
    mockResponse,
    getLogList,
    getMockList,
    getMock,
  });
};
