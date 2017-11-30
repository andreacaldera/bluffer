import { put, call, takeEvery } from 'redux-saga/effects';

import superagent from 'superagent';

import { ADD_PROXY_RESPONSE, DELETE_PROXY_RESPONSE, SET_PROXY_RESPONSE, PROXY_RESPONSE_DELETED } from '../common/modules/proxy/constants';
import { DISPLAY_ERROR, DISPLAY_INFO } from '../common/modules/meta/constants';

const callApi = (path, payload) => () =>
  superagent.post(`/api/bluffer/${path}`)
    .send(payload)
    .set('Accept', 'application/json')
    .timeout({ response: 9000, deadline: 10000 })
    .then(({ body }) => body);

function* setResponse({ payload }) {
  try {
    const response = yield call(callApi('set-proxy-response', payload));
    yield put({ type: ADD_PROXY_RESPONSE, payload: response });
  } catch (err) {
    yield put({ type: DISPLAY_ERROR, payload: `Unable to save response: ${err.message}` });
  }
}

function* deleteResponse({ payload }) {
  try {
    yield call(callApi('delete-proxy-response', { url: payload }));
    yield put({ type: PROXY_RESPONSE_DELETED, payload });
    yield put({ type: DISPLAY_INFO, payload: 'Response deleted successfully' });
  } catch (err) {
    yield put({ type: DISPLAY_ERROR, payload: `Unable to delete response: ${err.message}` });
  }
}

function* watchSetResponse() {
  yield takeEvery(SET_PROXY_RESPONSE, setResponse);
}

function* watchDeleteResponse() {
  yield takeEvery(DELETE_PROXY_RESPONSE, deleteResponse);
}

export default function* sagas() {
  yield [watchSetResponse(), watchDeleteResponse()];
}
