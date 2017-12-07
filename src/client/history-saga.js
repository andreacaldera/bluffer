import { takeLatest, put } from 'redux-saga/effects';

import history from './history';

function* changeRoute({ payload }) {
  history.push(payload);
  yield put({ type: 'ROUTE_CHANGED' });
}

function* watchRoute() {
  yield takeLatest('CHANGE_ROUTE', changeRoute);
}

export default function* sagas() {
  yield [watchRoute()];
}
