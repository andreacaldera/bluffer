import Express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import winston from 'winston';
import bodyParser from 'body-parser';

import ui from './ui';
import proxy from './proxy';
import api from './api';
import cacheStoreFactory from './cache-store';

const cacheStore = cacheStoreFactory();
const app = Express();
const port = 5001;

winston.level = 'debug';

app.use(cookieParser());

app.use('/dist', Express.static(path.join(__dirname, '../../dist')));

app.use('/api/bluffer*', bodyParser.json());
app.use('/api/bluffer', api(cacheStore));

app.use('/api', proxy(cacheStore));

app.use(ui(port, cacheStore));

app.listen(port, (error) => {
  if (error) {
    winston.error(error);
  } else {
    winston.info(`Monty proxy: http://localhost:${port}/`);
  }
});
