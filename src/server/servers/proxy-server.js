import Express from 'express';
import http from 'http';
import winston from 'winston';

import proxy from '../routes/proxy';

export default ({ port, proxyConfig, dataStore, socketIo }) => {
  const app = Express();
  const server = http.createServer(app);

  app.use('/api', proxy({ dataStore, proxyConfig, socketIo }));

  return new Promise((resolve, reject) => {
    server.listen(port, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(server);
        winston.info(`Proxy server listening: http://localhost:${port}/`);
      }
    });
  })
    .catch((err) => {
      winston.error('Unable to start proxy server', err);
    });
};
