import {
  SET_ACTIVE_PAGE,
  DISPLAY_INFO,
  DISPLAY_ERROR,
  CHANGE_ROUTE,
} from './constants';

const changeRoute = url => ({
  type: CHANGE_ROUTE,
  payload: url,
});

const setActivePage = (activePage) => ({
  type: SET_ACTIVE_PAGE,
  activePage,
});

const closeInfo = () => ({
  type: DISPLAY_INFO,
  payload: null,
});

const closeError = () => ({
  type: DISPLAY_ERROR,
  payload: null,
});

export default Object.freeze({
  changeRoute,
  setActivePage,
  closeInfo,
  closeError,
});
