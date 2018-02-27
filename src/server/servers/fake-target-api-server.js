import Express from 'express';
import http from 'http';

import logger from '../logger';

import targetApi from '../routes/target-api';

export default ({ port }) => {
  if (!port) {
    return;
  }

  const app = Express();
  const server = http.createServer(app);

  app.use(targetApi());

  return new Promise((resolve, reject) => {
    server.listen(port, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
        logger.info(`Fake target API Server listening: http://localhost:${port}/`);
      }
    });
  })
    .catch((err) => {
      logger.error('Unable to start fake target API server', err);
    });
};
