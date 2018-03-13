import fakeTargetApiServerFactory from './fake-target-api-server';
import appServerFactory from './app-server';
import proxyServerFactory from './proxy-server';

import config from '../config';
import storesFactory from '../stores';

const closeServer = (server) => {
  if (!server || !server.close) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    server.close((err) => err ? reject(err) : resolve());
  });
};

const shutdown = (servers, closeStoreConnection) => {
  if (global.process.env.NODE_ENV !== 'test') {
    return Promise.reject(new Error('You should only shutdown the app during testing'));
  }
  return Promise.all([...servers.map(closeServer), closeStoreConnection()]);
};

const createProxyServers = ({ socketIo, stores }) =>
  Promise.all(config.proxy.map((proxyConfig) =>
    proxyServerFactory({
      proxyConfig,
      socketIo,
      stores,
    })));

const createServers = (stores) =>
  Promise.all([fakeTargetApiServerFactory({ config }), appServerFactory({ config, stores })])
    .then(([{ server: fakeTargetApiServer }, { socketIo, server: appServer }]) =>
      createProxyServers({ socketIo, stores })
        .then((proxyServers) => [fakeTargetApiServer, appServer, ...proxyServers]));

export default () =>
  storesFactory(config)
    .then(({ stores, closeStoreConnection }) =>
      createServers(stores)
        .then((servers) => ({
          shutdown: () => shutdown(servers, closeStoreConnection),
          stores,
        })));
