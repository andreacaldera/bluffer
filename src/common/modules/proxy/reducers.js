import { combineReducers } from 'redux';

import { RESPONSE_LOGGED, FLASH_RESPONSE, PROXY_RESPONSE_DELETED } from './constants';

const logList = (state = [], action) => {
  switch (action.type) {
    case RESPONSE_LOGGED:
      return [action.payload].concat(state);
    case FLASH_RESPONSE:
      // TODO
      return [Object.assign({}, action.payload.response, { url: action.payload.url })].concat(state);
    case PROXY_RESPONSE_DELETED: {
      const newState = state.filter(({ url }) => action.payload !== url);
      return newState;
    }

    default: return state;
  }
};

const mockList = (state = []) => state;

module.exports = combineReducers({
  logList,
  mockList,
});
