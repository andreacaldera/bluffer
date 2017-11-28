import { combineReducers } from 'redux';

import { ADD_PROXY_RESPONSE, SELECT_PROXY_RESPONSE_URL } from './constants';

const all = (state = {}, action) => {
  switch (action.type) {
    case ADD_PROXY_RESPONSE:
      return {
        ...state,
        [action.payload.path]: action.payload.response,
      };
    default: return state;
  }
};

const selectedUrl = (state = null, action) => {
  switch (action.type) {
    case SELECT_PROXY_RESPONSE_URL:
      return action.payload;
    default: return state;
  }
};

module.exports = combineReducers({
  all,
  selectedUrl,
});
