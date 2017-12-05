import Express from 'express';
import http from 'http';
import winston from 'winston';

import targetApi from './routes/target-api';

export default ({ port }) => {
  const app = Express();
  const server = http.createServer(app);

  app.use('/target', targetApi());

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
