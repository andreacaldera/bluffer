import { CHANGE_SELECTED_PROXY, DELETE_ALL_LOGS } from './constants';

const changeSelectedProxy = newProxy => ({
  type: CHANGE_SELECTED_PROXY,
  payload: newProxy,
});

const deleteAllLogs = () => ({
  type: DELETE_ALL_LOGS,
});

export default Object.freeze({
  changeSelectedProxy,
  deleteAllLogs,
});
