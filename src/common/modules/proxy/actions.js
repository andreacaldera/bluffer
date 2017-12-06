import { DELETE_MOCK, MOCK_RESPONSE, DELETE_ALL_LOGS, DELETE_ALL_MOCKS } from './constants';

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
  deleteMock,
  deleteAllMocks,
  saveMockResponse,
  deleteAllLogs,
});
