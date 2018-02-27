import Express from 'express';
import http from 'http';
import logger from '../logger';

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
        logger.info(`Proxy server listening to ${proxyConfig.name} on : http://localhost:${proxyConfig.port}/`);
      }
    });
  })
    .catch((err) => {
      logger.error(`Unable to start proxy server ${proxyConfig.name} with error`, err);
    });
};
