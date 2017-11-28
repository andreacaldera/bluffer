import { takeEvery, put, call } from 'redux-saga/effects';
import superagent from 'superagent';

import { SET_PROXY_RESPONSE, SELECT_PROXY_RESPONSE_URL, DELETE_PROXY_RESPONSE, PROXY_RESPONSE_DELETED } from './constants';

const callApi = (path, payload) => () =>
  superagent.post(`/api/bluffer/${path}`)
    .send(payload)
    .set('Accept', 'application/json')
    .timeout({ response: 9000, deadline: 10000 })
    .then(({ body }) => body);

function* setResponse({ payload }) {
  try {
    yield call(callApi('set-proxy-response', payload));
    yield put({ type: SELECT_PROXY_RESPONSE_URL, payload: null });
  } catch (err) {
    // TODO display error to user
  }
}

function* deleteResponse({ payload }) {
  try {
    yield call(callApi('delete-proxy-response', { url: payload }));
    yield put({ type: PROXY_RESPONSE_DELETED, payload });
  } catch (err) {
    // TODO display error to user
  }
}

function* watchSetResponse() {
  yield takeEvery(SET_PROXY_RESPONSE, setResponse);
}

function* watchDeleteResponse() {
  yield takeEvery(DELETE_PROXY_RESPONSE, deleteResponse);
}

export default [watchSetResponse, watchDeleteResponse];
