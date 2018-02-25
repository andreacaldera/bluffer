import { combineReducers } from 'redux';
import { omit, without } from 'lodash';

import { MOCK_DELETED, MOCK_SERVED_RECENTLY, MOCK_SERVED_RECENTLY_CANCEL, RESPONSE_MOCKED, ALL_MOCKS_DELETED } from './constants';

const mocks = (state = {}, action) => {
  switch (action.type) {
    case RESPONSE_MOCKED: {
      const {
        proxyId,
        url,
      } = action.payload;
      return {
        ...state,
        [proxyId]: {
          ...state[proxyId],
          [url]: action.payload,
        },
      };
    }
    case MOCK_DELETED: {
      const { proxyId, url } = action.payload;
      return { ...state, [proxyId]: omit(state[proxyId], url) };
    }
    case ALL_MOCKS_DELETED: {
      return { ...state, [action.payload.proxyId]: {} };
    }
    default: return state;
  }
};

const activeMocks = (state = {}, action) => {
  switch (action.type) {
    case MOCK_SERVED_RECENTLY: {
      const { proxyId, url } = action.payload;
      return {
        ...state,
        [proxyId]: (state[proxyId] || []).concat(url),
      };
    }
    case MOCK_SERVED_RECENTLY_CANCEL: {
      const { proxyId, url } = action.payload;
      return {
        ...state,
        [proxyId]: without(state[proxyId], url),
      };
    }
    case MOCK_DELETED: {
      const { proxyId, url } = action.payload;
      return {
        ...state,
        [proxyId]: without(state[proxyId], url),
      };
    }
    case ALL_MOCKS_DELETED: {
      const { proxyId } = action.payload;
      return {
        ...state,
        [proxyId]: [],
      };
    }
    default: return state;
  }
};

module.exports = combineReducers({
  mocks,
  activeMocks,
});
