import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import meta from './meta';
import proxy from './proxy';

import { NAMESPACE } from './constants';

const rootReducer = combineReducers({
  meta,
  proxy,
});

module.exports = combineReducers({ routing: routerReducer, [NAMESPACE]: rootReducer });
