import { DELETE_MOCK, MOCK_RESPONSE, DELETE_ALL_MOCKS } from './constants';

const deleteMock = url => ({
  type: DELETE_MOCK,
  payload: url,
});

const deleteAllMocks = () => ({
  type: DELETE_ALL_MOCKS,
});

const saveMockResponse = (url, responseBody, httpMethod) => ({
  type: MOCK_RESPONSE,
  payload: { url, responseBody, httpMethod },
});

export default Object.freeze({
  deleteMock,
  deleteAllMocks,
  saveMockResponse,
});
