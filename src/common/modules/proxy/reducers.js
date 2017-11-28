import { combineReducers } from 'redux';

import { ADD_PROXY_RESPONSE } from './constants';

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

module.exports = combineReducers({
  all,
});
