import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';
import Router from 'react-router-dom/Router';
import { renderRoutes } from 'react-router-config';
import createHistory from 'history/createBrowserHistory';

import configureStore from '../common/store/configure-store';
import routes from '../common/routes';

import socketIoClient from './socket-io-client';
import apiClient from './api-client';

const store = configureStore(window.__initialState__, true, socketIoClient, apiClient);

render(
  <Provider store={store}>
    <Router history={createHistory()}>
      {renderRoutes(routes)}
    </Router>
  </Provider>,
  document.getElementById('app')
);
