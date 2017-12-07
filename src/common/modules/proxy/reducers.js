import { combineReducers } from 'redux';

import { CHANGE_SELECTED_PROXY, RESPONSE_LOGGED, MOCK_DELETED, MOCK_SERVED_RECENTLY, MOCK_SERVED_RECENTLY_CANCEL, RESPONSE_MOCKED, ALL_LOGS_DELETED, ALL_MOCKS_DELETED } from './constants';

const logs = (state = {}, action) => {
  switch (action.type) {
    case RESPONSE_LOGGED: {
      const { proxyId, loggedResponse } = action.payload;
      const proxyLogs = [loggedResponse].concat(state[proxyId]);
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
      const proxyMocks = { ...state[action.payload.proxyId], [action.payload.mockedResponse.url]: action.payload.mockedResponse };
      return { ...state, [action.payload.proxyId]: proxyMocks };
    }
    case MOCK_SERVED_RECENTLY: {
      const updatedMock = { ...state[action.payload.proxyId][action.payload.url], mockHasBeenServedRecently: true };
      const proxyMocks = { ...state[action.payload.proxyId], [action.payload.url]: updatedMock };
      return { ...state, [action.payload.proxyId]: proxyMocks };
    }
    case MOCK_SERVED_RECENTLY_CANCEL: {
      const updatedMock = { ...state[action.payload.proxyId][action.payload.url], mockHasBeenServedRecently: false };
      const proxyMocks = { ...state[action.payload.proxyId], [action.payload.url]: updatedMock };
      return { ...state, [action.payload.proxyId]: proxyMocks };
    }
    case MOCK_DELETED: {
      const proxyMocks = state[action.payload.proxyId];
      delete proxyMocks[action.payload.url];
      return { ...state, [action.payload.proxyId]: proxyMocks };
    }
    case ALL_MOCKS_DELETED: {
      return {};
    }
    default: return state;
  }
};

module.exports = combineReducers({
  config: (state = {}) => state,
  logs,
  mocks,
  selectedProxy,
});
