import { createStore, compose, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createLogger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import reducer from '../modules';
import sagas from '../modules/sagas';

const configureStore = (history, initialState, clientMiddleware, clientSagas) => {
  const sagaMiddleware = createSagaMiddleware();
  const router = routerMiddleware(history);

  const commonMiddlewares = [router, sagaMiddleware];

  const middlewares = clientMiddleware ? commonMiddlewares.concat(createLogger) : commonMiddlewares;

  const store = createStore(
    reducer,
    initialState,
    compose(applyMiddleware(...middlewares))
  );

  sagaMiddleware.run(sagas);
  if (clientSagas) {
    sagaMiddleware.run(clientSagas);
  }

  return store;
};


export default configureStore;
