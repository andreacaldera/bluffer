import Express from 'express';
import http from 'http';
import winston from 'winston';

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
        winston.info(`Fake target API Server listening: http://localhost:${port}/`);
      }
    });
  })
    .catch((err) => {
      winston.error('Unable to start fake target API server', err);
    });
};
