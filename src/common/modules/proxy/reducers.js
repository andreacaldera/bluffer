import { combineReducers } from 'redux';

import { CHANGE_SELECTED_PROXY, RESPONSE_LOGGED, ALL_LOGS_DELETED } from './constants';

const logs = (state = {}, action) => {
  switch (action.type) {
    case RESPONSE_LOGGED: {
      const { proxyId, loggedResponse } = action.payload;
      const proxyLogs = [loggedResponse].concat(state[proxyId] || []);
      return { ...state, [proxyId]: proxyLogs };
    }
    case ALL_LOGS_DELETED: {
      return { ...state, [action.payload.proxyId]: [] };
    }
    default: return state;
  }
};

const selectedProxy = (state = null, action) => {
  switch (action.type) {
    case CHANGE_SELECTED_PROXY: {
      return action.payload;
    }
    default: return state;
  }
};

module.exports = combineReducers({
  config: (state = {}) => state,
  logs,
  selectedProxy,
});
