import { eventChannel, delay } from 'redux-saga';
import { put, call, cancelled, take, takeLatest } from 'redux-saga/effects';
import io from 'socket.io-client';

import { RESPONSE_LOGGED, MOCK_SERVED_RECENTLY, MOCK_SERVED_RECENTLY_CANCEL } from '../common/modules/proxy/constants';
import { DISPLAY_ERROR } from '../common/modules/meta/constants';

const socket = io('', { path: '/api/bluffer-socket' });

function registerSocket() {
  return eventChannel((emitter) => {
    socket.on('request-proxied', (data) => {
      emitter({ loggedResponse: data });
    });
    socket.on('mock_served', (data) => {
      emitter({ recentlyServedMock: data });
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
      // TODO - Make not ugly
      if (socketEventData.loggedResponse) {
        yield put({ type: RESPONSE_LOGGED, payload: socketEventData.loggedResponse });
      }
      if (socketEventData.recentlyServedMock) {
        yield put({ type: MOCK_SERVED_RECENTLY, payload: socketEventData.recentlyServedMock });
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
  yield call(delay, 1000);
  yield put({ type: MOCK_SERVED_RECENTLY_CANCEL, payload });
}

function* watchRecentlyUsedMock() {
  yield takeLatest(MOCK_SERVED_RECENTLY, cancelRecentlyUsedMock);
}

export default function* sagas() {
  yield [watchSocketEvents(), watchRecentlyUsedMock()];
}
