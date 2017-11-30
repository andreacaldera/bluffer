import { combineReducers } from 'redux';

import { ADD_PROXY_RESPONSE, FLASH_RESPONSE, PROXY_RESPONSE_DELETED } from './constants';

const logList = (state = [], action) => {
  switch (action.type) {
    case ADD_PROXY_RESPONSE:
      return [
        {
          ...action.payload.response,
          url: action.payload.url,
        },
        ...state,
      ];
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
