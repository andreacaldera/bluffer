import { combineReducers } from 'redux';

import { SET_ACTIVE_PAGE, DISPLAY_INFO, DISPLAY_ERROR } from './constants';

const activePage = (state = '', action) => {
  switch (action.type) {
    case SET_ACTIVE_PAGE:
      return action.activePage;
    default: return state;
  }
};

const info = (state = null, action) => {
  switch (action.type) {
    case DISPLAY_INFO:
      return action.payload;
    default: return state;
  }
};

const error = (state = null, action) => {
  switch (action.type) {
    case DISPLAY_ERROR:
      return action.payload;
    default: return state;
  }
};

module.exports = combineReducers({
  featureToggles: (state = []) => state,
  activePage,
  info,
  error,
});
