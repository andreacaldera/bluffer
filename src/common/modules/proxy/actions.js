import { CHANGE_SELECTED_PROXY, DELETE_MOCK, MOCK_RESPONSE, DELETE_ALL_LOGS, DELETE_ALL_MOCKS } from './constants';

const changeSelectedProxy = newProxy => ({
  type: CHANGE_SELECTED_PROXY,
  payload: newProxy,
});

const deleteMock = url => ({
  type: DELETE_MOCK,
  payload: url,
});

const deleteAllMocks = () => ({
  type: DELETE_ALL_MOCKS,
});

const saveMockResponse = (url, responseBody) => ({
  type: MOCK_RESPONSE,
  payload: { url, responseBody },
});

const deleteAllLogs = () => ({
  type: DELETE_ALL_LOGS,
});

export default Object.freeze({
  changeSelectedProxy,
  deleteMock,
  deleteAllMocks,
  saveMockResponse,
  deleteAllLogs,
});
