import { createStore, compose, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createLogger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import reducer from '../modules';
import sagas from '../modules/sagas';

const configureStore = (history, initialState, isClient, socketIoClient, apiClient) => {
  const sagaMiddleware = createSagaMiddleware();
  const router = routerMiddleware(history);

  const commonMiddlewares = [router, sagaMiddleware];

  const middlewares = isClient ? commonMiddlewares.concat(createLogger) : commonMiddlewares;

  const composeEnhancers = isClient && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;

  const store = createStore(
    reducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  );

  sagaMiddleware.run(sagas);
  if (socketIoClient) {
    sagaMiddleware.run(socketIoClient);
  }
  if (apiClient) {
    sagaMiddleware.run(apiClient);
  }

  return store;
};


export default configureStore;
