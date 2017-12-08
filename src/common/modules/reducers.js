import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import meta from './meta';
import proxy from './proxy';
import mocks from './mocks';

import { NAMESPACE } from './constants';

const rootReducer = combineReducers({
  meta,
  proxy,
  mocks,
});

module.exports = combineReducers({ routing: routerReducer, [NAMESPACE]: rootReducer });
