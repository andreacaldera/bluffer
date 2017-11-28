import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import Home from './components/Home';
import Proxy from './components/Proxy';
import NotFound from './components/NotFound';

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="proxy" component={Proxy} />
    <Route path="*" component={NotFound} />
  </Route>
);

export default routes;
