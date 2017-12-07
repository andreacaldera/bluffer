const changeRoute = url => ({
  type: 'CHANGE_ROUTE',
  payload: url,
});

export default Object.freeze({
  changeRoute,
});
