import Express from 'express';
import http from 'http';
import path from 'path';
import cookieParser from 'cookie-parser';
import socketIo from 'socket.io';

import logger from '../logger';

import ui from '../routes/ui';
import api from '../routes/api';

export default ({ config, stores }) => {
  const app = Express();
  const server = http.createServer(app);

  const { appPort } = config;

  app.use(cookieParser());
  app.use('/dist', Express.static(path.join(__dirname, '../../../dist')));
  app.use('/public', Express.static(path.join(__dirname, '../../../public')));

  const io = new socketIo(server, { path: '/api/bluffer-socket' });

  app.use('/api/bluffer', api({ stores }));
  app.use(ui({ stores, config }));

  return new Promise((resolve, reject) => {
    server.listen(appPort, (err) => {
      if (err) {
        logger.error('Unable to start bluffer server', err);
        reject(err);
      } else {
        resolve({ server, socketIo: io });
        logger.info(`Bluffer server listening: http://localhost:${appPort}/`);
      }
    });
  });
};
