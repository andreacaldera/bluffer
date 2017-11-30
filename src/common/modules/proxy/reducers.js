import { combineReducers } from 'redux';

import { RESPONSE_LOGGED, FLASH_RESPONSE, MOCK_DELETED, RESPONSE_MOCKED } from './constants';

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
    case FLASH_RESPONSE:
      // TODO
      return state;
      // return [Object.assign({}, action.payload.response, { url: action.payload.url })].concat(state);
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
