import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';
import Router from 'react-router-dom/Router';
import { renderRoutes } from 'react-router-config';

import configureStore from '../common/store/configure-store';
import routes from '../common/routes';

import history from './history';

import socketIoClient from './socket-io-client';
import apiClient from './api-client';
import historySaga from './history-saga';

const store = configureStore(window.__initialState__, true, socketIoClient, apiClient, historySaga);

render(
  <Provider store={store}>
    <Router history={history}>
      {renderRoutes(routes)}
    </Router>
  </Provider>,
  document.getElementById('app')
);
