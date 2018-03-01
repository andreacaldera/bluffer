import fakeTargetApiServer from './fake-target-api-server';
import appServer from './app-server';
import proxyServer from './proxy-server';

import config from '../config';
import storesFactory from '../stores';

const { appPort, fakeTargetApiPort } = config;

Promise.resolve()
  .then(() => storesFactory(config))
  .then(({ logResonseStore, mockResonseStore }) =>
    appServer({
      port: appPort,
      config,
      logResonseStore,
      mockResonseStore,
    }).then(({ socketIo }) => ({ socketIo, logResonseStore, mockResonseStore })))
  .then(({ socketIo, logResonseStore, mockResonseStore }) =>
    Promise.all(config.proxy.map((proxyConfig) =>
      proxyServer({
        proxyConfig,
        socketIo,
        logResonseStore,
        mockResonseStore,
      }))))
  .then(() =>
    fakeTargetApiServer({ port: fakeTargetApiPort }));
