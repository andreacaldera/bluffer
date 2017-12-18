import { takeLatest, put } from 'redux-saga/effects';

import { CHANGE_ROUTE, SET_ACTIVE_PAGE } from '../common/modules/meta/constants';

import history from './history';

function* changeRoute({ payload }) {
  history.push(payload.url);
  if (payload.activePage) {
    yield put({ type: SET_ACTIVE_PAGE, activePage: payload.activePage });
  }
}

function* watchRoute() {
  yield takeLatest(CHANGE_ROUTE, changeRoute);
}

export default function* sagas() {
  yield [watchRoute()];
}
