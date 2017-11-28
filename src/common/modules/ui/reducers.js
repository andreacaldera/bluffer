import { combineReducers } from 'redux';

import { HAS_REACHED_PAGE_BOTTOM, HAS_PASSED_HEIGHT_THRESHOLD } from './constants';

const hasReachedPageBottom = (state = false, action) => {
  switch (action.type) {
    case HAS_REACHED_PAGE_BOTTOM:
      return action.hasReachedPageBottom;
    default: return state;
  }
};

const hasPassedHeightThreshold = (state = false, action) => {
  switch (action.type) {
    case HAS_PASSED_HEIGHT_THRESHOLD:
      return action.hasPassedHeightThreshold;
    default: return state;
  }
};

module.exports = combineReducers({
  hasReachedPageBottom,
  hasPassedHeightThreshold,
});
