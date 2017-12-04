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
import mockDataFactory from './data-store';

const dataStore = mockDataFactory();
const app = Express();
const { port } = config;

winston.level = 'debug';

const server = http.createServer(app);

const io = new socketIo(server, { path: '/api/bluffer-socket' });

app.use(cookieParser());
app.use('/dist', Express.static(path.join(__dirname, '../../dist')));
app.use('/public', Express.static(path.join(__dirname, '../../public')));
app.use('/api/bluffer', api(dataStore));
app.use('/target', targetApi(dataStore, config.proxy));
app.use('/api', proxy(dataStore, config.proxy, io));
app.use(ui(port, dataStore));

server.listen(port, (error) => {
  if (error) {
    winston.error(error);
  } else {
    winston.info(`Bluffer proxy: http://localhost:${port}/`);
  }
});
