import Express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import http from 'http';
import winston from 'winston';

import socketIo from 'socket.io';

import config from './config';
import ui from './routes/ui';
import proxy from './routes/proxy';
import api from './routes/api';
import targetApi from './routes/target-api';
import cacheStoreFactory from './cache-store';

const cacheStore = cacheStoreFactory();
const app = Express();
const { port } = config;

winston.level = 'debug';

const server = http.createServer(app);

const io = new socketIo(server, { path: '/api/bluffer-socket' });

app.use(cookieParser());
app.use('/dist', Express.static(path.join(__dirname, '../../dist')));
app.use('/api/bluffer', api(cacheStore));
app.use('/target', targetApi(cacheStore, config.proxy));
app.use('/api', proxy(cacheStore, config.proxy, io));
app.use(ui(port, cacheStore));

server.listen(port, (error) => {
  if (error) {
    winston.error(error);
  } else {
    winston.info(`Bluffer proxy: http://localhost:${port}/`);
  }
});
