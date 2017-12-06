import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { createMemoryHistory, match, RouterContext } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import UrlPatter from 'url-pattern';
import _ from 'lodash';
import qs from 'qs';

import configureStore from '../../common/store/configure-store';
import routes from '../../common/routes';
import { NAMESPACE } from '../../common/modules/constants';

const urlPattern = new UrlPatter('/:activePage');

const getActiveFeatureToggles = (req) => {
  const params = qs.parse(req.query);
  const activeFeatureToggles = (params['feature-toggles'] !== undefined ?
    _.compact(params['feature-toggles']) :
    req.cookies.featureToggles);
  return activeFeatureToggles || [];
};

export default (dataStore) => {
  function renderFullPage(content, store) {
    return `
      <!doctype html>
      <html>
        <head>
        <link rel="apple-touch-icon" sizes="57x57" href="/public/favicons/apple-icon-57x57.png">
        <link rel="apple-touch-icon" sizes="60x60" href="/public/favicons/apple-icon-60x60.png">
        <link rel="apple-touch-icon" sizes="72x72" href="/public/favicons/apple-icon-72x72.png">
        <link rel="apple-touch-icon" sizes="76x76" href="/public/favicons/apple-icon-76x76.png">
        <link rel="apple-touch-icon" sizes="114x114" href="/public/favicons/apple-icon-114x114.png">
        <link rel="apple-touch-icon" sizes="120x120" href="/public/favicons/apple-icon-120x120.png">
        <link rel="apple-touch-icon" sizes="144x144" href="/public/favicons/apple-icon-144x144.png">
        <link rel="apple-touch-icon" sizes="152x152" href="/public/favicons/apple-icon-152x152.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/public/favicons/apple-icon-180x180.png">
        <link rel="icon" type="image/png" sizes="192x192" href="/public/favicons/android-icon-192x192.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/public/favicons/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="96x96" href="/public/favicons/favicon-96x96.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/public/favicons/favicon-16x16.png">
        <link rel="manifest" href="/manifest.json">
        <meta name="msapplication-TileColor" content="#ffffff">
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png">
        <meta name="theme-color" content="#ffffff">
          <link rel="stylesheet" type="text/css" href="/dist/bluffer.css" />
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous" />
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
        <title>Bluffer</title>
        </head>
        <body>
          <div id="app">${content}</div>
          <script>window.__initialState__ = ${JSON.stringify(store.getState()).replace(/</g, '\\x3c')}</script>
          <script src="/dist/bluffer.js"></script>
        </body>
      </html>
      `;
  }

  return (req, res) => {
    const activePage = _.get(urlPattern.match(req.url), 'activePage', 'home');
    const activeFeatureToggles = getActiveFeatureToggles(req);
    res.cookie('featureToggles', activeFeatureToggles);
    const preloadedState = { [NAMESPACE]: {
      meta: { activePage, featureToggles: activeFeatureToggles },
      proxy: {
        logList: dataStore.getLogList(),
        mockList: dataStore.getMockList(),
      },
    } };
    const memoryHistory = createMemoryHistory(req.url);
    const store = configureStore(memoryHistory, preloadedState);
    const history = syncHistoryWithStore(memoryHistory, store);

    match({ history, routes, location: req.url }, (error, redirectLocation, renderProps) => {
      if (error) {
        res.status(500).send(error.message);
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        const content = renderToString(
          <Provider store={store}>
            <RouterContext {...renderProps} />
          </Provider>
        );
        res.send(renderFullPage(content, store));
      }
    });
  };
};
