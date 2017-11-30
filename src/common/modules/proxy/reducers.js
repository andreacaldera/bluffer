import { combineReducers } from 'redux';

import { RESPONSE_LOGGED, MOCK_DELETED, MOCK_SERVED_RECENTLY, MOCK_SERVED_RECENTLY_CANCEL, PROXY_RESPONSE_DELETED, RESPONSE_MOCKED } from './constants';

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
    default: return state;
  }
};

module.exports = combineReducers({
  logList,
  mockList,
});
