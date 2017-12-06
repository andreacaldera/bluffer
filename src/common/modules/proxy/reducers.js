import { combineReducers } from 'redux';

import { CHANGE_SELECTED_PROXY, RESPONSE_LOGGED, MOCK_DELETED, MOCK_SERVED_RECENTLY, MOCK_SERVED_RECENTLY_CANCEL, PROXY_RESPONSE_DELETED, RESPONSE_MOCKED, ALL_LOGS_DELETED, ALL_MOCKS_DELETED } from './constants';

const logs = (state = {}, action) => {
  switch (action.type) {
    case RESPONSE_LOGGED: {
      const { proxy, loggedResponse } = action.payload;
      const proxyLogs = [loggedResponse].concat(state[proxy]);
      return { ...state, [proxy]: proxyLogs };
    }
    case ALL_LOGS_DELETED: {
      return { ...state, [action.payload.proxy]: [] };
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

const mockList = (state = [], action) => {
  switch (action.type) {
    case RESPONSE_MOCKED:
      return [action.payload].concat(state.filter(({ url }) => url !== action.payload.url));
    case MOCK_SERVED_RECENTLY: {
      return state.map((mock) =>
        mock.url === action.payload.url ?
          Object.assign({}, mock, { mockHasBeenServedRecently: true }) :
          mock
      );
    }
    case MOCK_SERVED_RECENTLY_CANCEL: {
      return state.map((mock) =>
        mock.url === action.payload.url ?
          Object.assign({}, mock, { mockHasBeenServedRecently: false }) :
          mock
      );
    }
    case PROXY_RESPONSE_DELETED: {
      // TODO
      return state;
    }
    case MOCK_DELETED: {
      return state.filter(({ url }) => url !== action.payload);
    }
    case ALL_MOCKS_DELETED: {
      return [];
    }
    default: return state;
  }
};

module.exports = combineReducers({
  config: (state = {}) => state,
  logs,
  mockList,
  selectedProxy,
});
