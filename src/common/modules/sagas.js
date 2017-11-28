import { delay } from 'redux-saga';
import { call, put, takeEvery } from 'redux-saga/effects';

import proxySagas from './proxy/sagas';

export function* startSaga() {
  // console.log('Now running sagas!');
  yield put({ type: 'SAGA_STARTED' });
}

export function* watchAction() {
  yield call(delay, 1000); // Just to demonstrate delay
  // console.log('Watching action...');
  // yield put({ type: 'INCREMENT' }); // Do sommething here
}

export function* watchActions() {
  yield takeEvery('*', watchAction);
}

export default function* rootSaga() {
  yield [
    startSaga(),
    watchActions(),
    proxySagas.map((saga) => saga()),
  ];
}
