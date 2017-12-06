import Express from 'express';
import http from 'http';
import winston from 'winston';

import proxy from '../routes/proxy';

export default ({ proxyConfig, dataStore, socketIo }) => {
  const app = Express();
  const server = http.createServer(app);

  app.use(proxy({ dataStore, proxyConfig, socketIo }));

  return new Promise((resolve, reject) => {
    server.listen(proxyConfig.port, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(server);
        winston.info(`Proxy server listening: http://localhost:${proxyConfig.port}/`);
      }
    });
  })
    .catch((err) => {
      winston.error('Unable to start proxy server', err);
    });
};
