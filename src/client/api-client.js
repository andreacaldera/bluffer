import { put, call, takeEvery, takeLatest, select } from 'redux-saga/effects';

import superagent from 'superagent';

import {
  DELETE_ALL_LOGS,
  ALL_LOGS_DELETED,
} from '../common/modules/proxy/constants';
import {
  RESPONSE_MOCKED,
  DELETE_MOCK,
  MOCK_RESPONSE,
  MOCK_DELETED,
  DELETE_ALL_MOCKS,
  ALL_MOCKS_DELETED,
} from '../common/modules/mocks/constants';
import { DISPLAY_ERROR, DISPLAY_INFO } from '../common/modules/meta/constants';
import { getSelectedProxyId } from '../common/modules/proxy/selectors';

const callApi = (path, payload) => () =>
  superagent.post(`/api/bluffer/${path}`)
    .send(payload)
    .set('Accept', 'application/json')
    .timeout({ response: 9000, deadline: 10000 })
    .then(({ body }) => body);

function* mockResponse({ payload }) {
  try {
    const proxyId = yield select(getSelectedProxyId);
    const {
      responseBody,
      timestamp,
      url,
      httpMethod,
      contentType,
    } = yield call(callApi('set-mock', { ...payload, proxyId }));
    yield put({
      type: RESPONSE_MOCKED,
      payload: {
        responseBody,
        timestamp,
        proxyId,
        url,
        httpMethod,
        contentType,
      },
    });
  } catch (err) {
    yield put({ type: DISPLAY_ERROR, payload: `Unable to mock response: ${err.message}` });
  }
}

function* deleteResponse({ payload }) {
  try {
    const proxyId = yield select(getSelectedProxyId);
    yield call(callApi('delete-mock', { url: payload, proxyId }));
    yield put({ type: MOCK_DELETED, payload: { url: payload, proxyId } });
    yield put({ type: DISPLAY_INFO, payload: 'Response deleted successfully' });
  } catch (err) {
    yield put({ type: DISPLAY_ERROR, payload: `Unable to delete response: ${err.message}` });
  }
}

function* deleteAllLogs() { // TODO refactor
  try {
    const proxyId = yield select(getSelectedProxyId);
    yield call(callApi('delete-all-proxies-response', { proxyId }));
    yield put({ type: ALL_LOGS_DELETED, payload: { proxyId } });
    yield put({ type: DISPLAY_INFO, payload: 'All logs cleared' });
  } catch (err) {
    yield put({ type: DISPLAY_ERROR, payload: `Unable to clear logs: ${err.message}` });
  }
}

function* deleteAllMocks() {
  try {
    const proxyId = yield select(getSelectedProxyId);
    yield call(callApi('delete-all-mocks', { proxyId }));
    yield put({ type: ALL_MOCKS_DELETED, payload: { proxyId } });
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
