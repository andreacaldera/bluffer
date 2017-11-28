import { takeEvery, put, call, cancelled, take } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import superagent from 'superagent';
import io from 'socket.io-client';

import { ADD_PROXY_RESPONSE, SET_PROXY_RESPONSE, SELECT_PROXY_RESPONSE_URL, DELETE_PROXY_RESPONSE, PROXY_RESPONSE_DELETED } from './constants';
import { DISPLAY_INFO, DISPLAY_ERROR } from '../meta/constants';

const socket = io('', { path: '/api/bluffer-socket' });
socket.emit('new channel', 'AHHH');

function registerSocket() {
  return eventChannel((emitter) => {
    socket.on('request-proxied', (data) => {
      emitter(data);
    });
    const unsubscribe = () => {
    };
    return unsubscribe;
  });
}

function* watchSocketEvents() {
  const socketEventHandler = yield call(registerSocket);
  const forever = true;
  try {
    while (forever) {
      const socketEventData = yield take(socketEventHandler);
      yield put({ type: ADD_PROXY_RESPONSE, payload: socketEventData });
    }
  } catch (err) {
    if (yield cancelled()) {
      socketEventHandler.close();
    } else {
      yield put({ type: DISPLAY_ERROR, payload: `Unable to live stream proxied requests: ${err.message}` });
    }
  }
}

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

export default [watchSetResponse, watchDeleteResponse, watchSocketEvents];
