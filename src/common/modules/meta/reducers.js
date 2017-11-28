import { combineReducers } from 'redux';

import { SET_ACTIVE_PAGE } from './constants';

const activePage = (state = '', action) => {
  switch (action.type) {
    case SET_ACTIVE_PAGE:
      return action.activePage;
    default: return state;
  }
};

module.exports = combineReducers({
  featureToggles: (state = []) => state,
  activePage,
});
