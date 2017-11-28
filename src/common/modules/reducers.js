import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import meta from './meta';
import proxy from './proxy';
import ui from './ui';

import { NAMESPACE } from './constants';

const rootReducer = combineReducers({
  meta,
  proxy,
  ui,
});

module.exports = combineReducers({ routing: routerReducer, [NAMESPACE]: rootReducer });
