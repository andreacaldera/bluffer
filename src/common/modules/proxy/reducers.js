import { combineReducers } from 'redux';
import { omit, without } from 'lodash';

import { CHANGE_SELECTED_PROXY, RESPONSE_LOGGED, MOCK_DELETED, MOCK_SERVED_RECENTLY, MOCK_SERVED_RECENTLY_CANCEL, RESPONSE_MOCKED, ALL_LOGS_DELETED, ALL_MOCKS_DELETED } from './constants';

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

const mocks = (state = {}, action) => {
  switch (action.type) {
    case RESPONSE_MOCKED: {
      const {
        proxyId,
        url,
        responseBody,
        timestamp,
      } = action.payload;
      return {
        ...state,
        [proxyId]: {
          ...state[proxyId],
          [url]: { responseBody, timestamp, url },
        },
      };
    }
    case MOCK_DELETED: {
      const { proxyId, url } = action.payload;
      return { ...state, [proxyId]: omit(state[proxyId], url) };
    }
    case ALL_MOCKS_DELETED: {
      return { ...state, [action.payload.proxyId]: {} };
    }
    default: return state;
  }
};

const activeMocks = (state = {}, action) => {
  switch (action.type) {
    case MOCK_SERVED_RECENTLY: {
      const { proxyId, url } = action.payload;
      return {
        ...state,
        [proxyId]: (state[proxyId] || []).concat(url),
      };
    }
    case MOCK_SERVED_RECENTLY_CANCEL: {
      const { proxyId, url } = action.payload;
      return {
        ...state,
        [proxyId]: without(state[proxyId], url),
      };
    }
    case MOCK_DELETED: {
      const { proxyId, url } = action.payload;
      return {
        ...state,
        [proxyId]: without(state[proxyId], url),
      };
    }
    case ALL_MOCKS_DELETED: {
      const { proxyId } = action.payload;
      return {
        ...state,
        [proxyId]: [],
      };
    }
    default: return state;
  }
};

module.exports = combineReducers({
  config: (state = {}) => state,
  logs,
  mocks,
  selectedProxy,
  activeMocks,
});
