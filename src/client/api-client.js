import { put, call, takeEvery, takeLatest, select } from 'redux-saga/effects';

import superagent from 'superagent';

import {
  RESPONSE_MOCKED,
  DELETE_MOCK, MOCK_RESPONSE,
  MOCK_DELETED,
  DELETE_ALL_LOGS,
  ALL_LOGS_DELETED,
  DELETE_ALL_MOCKS,
  ALL_MOCKS_DELETED,
} from '../common/modules/proxy/constants';
import { DISPLAY_ERROR, DISPLAY_INFO } from '../common/modules/meta/constants';
import { getSelectedProxy } from '../common/modules/proxy/selectors';

const callApi = (path, payload) => () =>
  superagent.post(`/api/bluffer/${path}`)
    .send(payload)
    .set('Accept', 'application/json')
    .timeout({ response: 9000, deadline: 10000 })
    .then(({ body }) => body);

function* mockResponse({ payload }) {
  try {
    const mockedResponse = yield call(callApi('set-proxy-response', payload));
    yield put({ type: RESPONSE_MOCKED, payload: mockedResponse });
  } catch (err) {
    yield put({ type: DISPLAY_ERROR, payload: `Unable to mock response: ${err.message}` });
  }
}

function* deleteResponse({ payload }) {
  try {
    yield call(callApi('delete-proxy-response', { url: payload }));
    yield put({ type: MOCK_DELETED, payload });
    yield put({ type: DISPLAY_INFO, payload: 'Response deleted successfully' });
  } catch (err) {
    yield put({ type: DISPLAY_ERROR, payload: `Unable to delete response: ${err.message}` });
  }
}

function* deleteAllLogs() {
  try {
    const selectedProxy = yield select(getSelectedProxy);
    yield call(callApi('delete-all-logs', { selectedProxy }));
    yield put({ type: ALL_LOGS_DELETED, payload: { proxy: selectedProxy } });
    yield put({ type: DISPLAY_INFO, payload: 'All logs cleared' });
  } catch (err) {
    yield put({ type: DISPLAY_ERROR, payload: `Unable to clear logs: ${err.message}` });
  }
}

function* deleteAllMocks() {
  try {
    yield call(callApi('delete-all-mocks'));
    yield put({ type: ALL_MOCKS_DELETED });
    yield put({ type: DISPLAY_INFO, payload: 'All mocks cleared' });
  } catch (err) {
    yield put({ type: DISPLAY_ERROR, payload: `Unable to clear mocks: ${err.message}` });
  }
}

function* watchSetResponse() {
  yield takeEvery(MOCK_RESPONSE, mockResponse);
}

function* watchDeleteResponse() {
  yield takeEvery(DELETE_MOCK, deleteResponse);
}

function* watchDeleteAllLogs() {
  yield takeLatest(DELETE_ALL_LOGS, deleteAllLogs);
}

function* watchDeleteAllMocks() {
  yield takeLatest(DELETE_ALL_MOCKS, deleteAllMocks);
}

export default function* sagas() {
  yield [watchSetResponse(), watchDeleteResponse(), watchDeleteAllLogs(), watchDeleteAllMocks()];
}
