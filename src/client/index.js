import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from '../common/store/configure-store';
import routes from '../common/routes';

import socketIoClient from './socket-io-client';
import apiClient from './api-client';

const store = configureStore(browserHistory, window.__initialState__, true, socketIoClient, apiClient);
const history = syncHistoryWithStore(browserHistory, store);

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('app')
);
