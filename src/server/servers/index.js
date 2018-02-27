import fakeTargetApiServer from './fake-target-api-server';
import appServer from './app-server';
import proxyServer from './proxy-server';

import config from '../config';
import mockDataFactory from '../data-store';

const dataStore = mockDataFactory(config.proxy);
const { appPort, fakeTargetApiPort } = config;

Promise.resolve()
  .then(() =>
    appServer({ port: appPort, dataStore, config }))
  .then(({ socketIo }) =>
    Promise.all(config.proxy.map((proxyConfig) => proxyServer({ proxyConfig, dataStore, socketIo }))))
  .then(() =>
    fakeTargetApiServer({ port: fakeTargetApiPort }));
