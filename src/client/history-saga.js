import { takeLatest } from 'redux-saga/effects';

import { CHANGE_ROUTE } from '../common/modules/meta/constants';

import history from './history';

function* changeRoute({ payload }) {
  history.push(payload);
  yield;
}

function* watchRoute() {
  yield takeLatest(CHANGE_ROUTE, changeRoute);
}

export default function* sagas() {
  yield [watchRoute()];
}
