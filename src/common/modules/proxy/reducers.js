import { combineReducers } from 'redux';

import { ADD_PROXY_RESPONSE, SELECT_PROXY_RESPONSE_URL, PROXY_RESPONSE_DELETED } from './constants';

const all = (state = {}, action) => {
  switch (action.type) {
    case ADD_PROXY_RESPONSE:
      return {
        ...state,
        [action.payload.url]: action.payload.response,
      };

    case PROXY_RESPONSE_DELETED: {
      const newState = Object.assign({}, state);
      delete newState[action.payload]; // TODO make better
      return newState;
    }

    default: return state;
  }
};

const list = (state = [], action) => {
  switch (action.type) {
    case ADD_PROXY_RESPONSE:
      return [
        {
          ...action.payload.response,
          url: action.payload.url,
        },
        ...state,
      ];
    case PROXY_RESPONSE_DELETED: {
      const newState = state.filter(({ url }) => action.payload !== url);
      return newState;
    }

    default: return state;
  }
};

const selectedUrl = (state = null, action) => {
  switch (action.type) {
    case SELECT_PROXY_RESPONSE_URL:
      return action.payload;
    case PROXY_RESPONSE_DELETED:
      return action.payload === state ? null : state;
    default: return state;
  }
};

module.exports = combineReducers({
  all,
  selectedUrl,
  list,
});
