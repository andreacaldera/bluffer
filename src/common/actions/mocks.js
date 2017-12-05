import { DELETE_MOCK, MOCK_RESPONSE } from '../modules/proxy/constants';

export const deleteMock = url => ({
  type: DELETE_MOCK,
  payload: url,
});

export const deleteAllMocks = mocks => dispatch => {
  mocks.forEach(({ url }) => dispatch(deleteMock(url)));
};

export const saveMockResponse = (url, responseBody) => ({
  type: MOCK_RESPONSE,
  payload: { url, responseBody },
});
