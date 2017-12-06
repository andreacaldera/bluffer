import winston from 'winston';

import fakeTargetApiServer from './fake-target-api-server';
import appServer from './app-server';
import proxyServer from './proxy-server';

import config from '../config';
import mockDataFactory from '../data-store';

winston.level = config.logLevel;

const dataStore = mockDataFactory();
const { appPort, fakeTargetApiPort, proxyPort } = config;

Promise.resolve()
  .then(() =>
    appServer({ port: appPort, dataStore }))
  .then(({ socketIo }) =>
    proxyServer({ port: proxyPort, proxyConfig: config.proxy, dataStore, socketIo }))
  .then(() =>
    fakeTargetApiServer({ port: fakeTargetApiPort }));
