import Express from 'express';
import http from 'http';

import logger from '../logger';

import targetApi from '../routes/target-api';

export default ({ config }) => {
  const { fakeTargetApiPort } = config;
  if (!fakeTargetApiPort) {
    return Promise.resolve({ server: null });
  }

  const app = Express();
  const server = http.createServer(app);

  app.use(targetApi());

  // const close = () =>
  //   new Promise((resolve, reject) => {
  //     logger.debug(`Closing server running on port ${fakeTargetApiPort}`);
  //     server.close((err) => {
  //       if (err) {
  //         logger.err(`Unable to close server running on port ${fakeTargetApiPort}`, err);
  //         reject(err);
  //       }
  //       resolve();
  //     });
  //   });

  return new Promise((resolve, reject) => {
    server.listen(fakeTargetApiPort, (err) => {
      if (err) {
        logger.error('Unable to start fake target API server', err);
        reject(err);
      } else {
        resolve({ server });
        logger.info(`Fake target API Server listening: http://localhost:${fakeTargetApiPort}/`);
      }
    });
  });
};
