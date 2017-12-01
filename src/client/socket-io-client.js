import { eventChannel, delay } from 'redux-saga';
import { put, call, cancelled, take, takeEvery } from 'redux-saga/effects';
import io from 'socket.io-client';

import { RESPONSE_LOGGED, MOCK_SERVED_RECENTLY, MOCK_SERVED_RECENTLY_CANCEL } from '../common/modules/proxy/constants';
import { DISPLAY_ERROR } from '../common/modules/meta/constants';

const socket = io('', { path: '/api/bluffer-socket' });

function registerSocket() {
  return eventChannel((emitter) => {
    socket.on('request_proxied', (data) => {
      emitter({ ...data, type: 'request_proxied' });
    });
    socket.on('mock_served', (data) => {
      emitter({ ...data, type: 'mocked_served' });
    });
    const unsubscribe = () => {};
    return unsubscribe;
  });
}

function* watchSocketEvents() {
  const socketEventHandler = yield call(registerSocket);
  const forever = true;
  try {
    while (forever) {
      const socketEvent = yield take(socketEventHandler);
      switch (socketEvent.type) {
        case 'request_proxied':
          yield put({ type: RESPONSE_LOGGED, payload: socketEvent });
          break;
        case 'mocked_served':
          yield put({ type: MOCK_SERVED_RECENTLY, payload: socketEvent });
          break;
        default:
          throw new Error(`Unrecognised event ${socketEvent.type}`);
      }
    }
  } catch (err) {
    if (yield cancelled()) {
      socketEventHandler.close();
    } else {
      yield put({ type: DISPLAY_ERROR, payload: `Unable to live stream proxied requests: ${err.message}` });
    }
  }
}

function* cancelRecentlyUsedMock({ payload }) {
  yield delay(2000);
  yield put({ type: MOCK_SERVED_RECENTLY_CANCEL, payload });
}

function* watchRecentlyUsedMock() {
  yield takeEvery(MOCK_SERVED_RECENTLY, cancelRecentlyUsedMock);
}

export default function* sagas() {
  yield [watchSocketEvents(), watchRecentlyUsedMock()];
}
