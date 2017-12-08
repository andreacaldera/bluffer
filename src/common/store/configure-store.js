import { createStore, compose, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import reducer from '../modules';

const configureStore = (
  initialState,
  isClient,
  socketIoClient,
  apiClient,
  historySaga,
) => {
  const sagaMiddleware = createSagaMiddleware();

  const commonMiddlewares = [sagaMiddleware];

  const middlewares = isClient
    ? commonMiddlewares.concat(createLogger)
    : commonMiddlewares;

  const composeEnhancers =
    isClient && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      : compose;

  const store = createStore(
    reducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares)),
  );

  if (socketIoClient) {
    sagaMiddleware.run(socketIoClient);
  }
  if (apiClient) {
    sagaMiddleware.run(apiClient);
  }
  if (historySaga) {
    sagaMiddleware.run(historySaga);
  }

  return store;
};

export default configureStore;
