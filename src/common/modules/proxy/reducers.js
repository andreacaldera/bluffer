import { combineReducers } from 'redux';

import { RESPONSE_LOGGED, MOCK_SERVED_RECENTLY, MOCK_SERVED_RECENTLY_CANCEL, PROXY_RESPONSE_DELETED, RESPONSE_MOCKED } from './constants';

const logList = (state = [], action) => {
  switch (action.type) {
    case RESPONSE_LOGGED:
      return [action.payload].concat(state);
    default: return state;
  }
};

const mockList = (state = [], action) => {
  switch (action.type) {
    case RESPONSE_MOCKED:
      return [action.payload].concat(state.filter(({ url }) => url !== action.payload.url));
    case MOCK_SERVED_RECENTLY: {
      const response = Object.assign({}, action.payload, {
        mockHasBeenServedRecently: true,
      });
      return [response].concat(state.filter(({ url }) => url !== action.payload.url));
    }
    case MOCK_SERVED_RECENTLY_CANCEL: {
      const response = Object.assign({}, action.payload, {
        mockHasBeenServedRecently: false,
      });
      return [response].concat(state.filter(({ url }) => url !== action.payload.url));
    }
    case PROXY_RESPONSE_DELETED: {
      // TODO
      return state;
    }
    default: return state;
  }
};

module.exports = combineReducers({
  logList,
  mockList,
});
