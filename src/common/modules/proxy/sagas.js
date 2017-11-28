import { takeEvery } from 'redux-saga/effects';
import superagent from 'superagent';

import { SET_PROXY_RESPONSE } from './constants';

const callSetResponseApi = ({ payload }) =>
  superagent.post('/api/proxy-response')
    .send(payload)
    .set('Accept', 'application/json')
    .timeout({ response: 9000, deadline: 10000 })
    .then(({ body }) => body);


function* watchSetResponse() {
  yield takeEvery(SET_PROXY_RESPONSE, callSetResponseApi);
}

export default [watchSetResponse];
