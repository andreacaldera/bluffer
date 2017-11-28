import { takeEvery, put, call } from 'redux-saga/effects';
import superagent from 'superagent';

import { SET_PROXY_RESPONSE, SELECT_PROXY_RESPONSE_URL } from './constants';

const callSetResponseApi = ({ payload }) => () =>
  superagent.post('/api/bluffer/proxy-response')
    .send(payload)
    .set('Accept', 'application/json')
    .timeout({ response: 9000, deadline: 10000 })
    .then(({ body }) => body);

function* setResponse({ payload }) {
  try {
    yield call(callSetResponseApi(payload));
    yield put({ type: SELECT_PROXY_RESPONSE_URL, payload: null });
  } catch (err) {
    // TODO display error to user
  }
}

function* watchSetResponse() {
  yield takeEvery(SET_PROXY_RESPONSE, setResponse);
}

export default [watchSetResponse];
