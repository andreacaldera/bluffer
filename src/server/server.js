import Express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import winston from 'winston';
import bodyParser from 'body-parser';

import ui from './ui';
import proxy from './proxy';

import cacheStoreFactory from './cache-store';

const cacheStore = cacheStoreFactory();
const app = Express();
const port = 5001;
const fakeServerPort = 5002;

winston.level = 'debug';

app.use('/api/proxy-response', bodyParser.json());
app.use(cookieParser());

app.use('/dist', Express.static(path.join(__dirname, '../../dist')));

app.use('/api', proxy(cacheStore));

app.get('/target*', (req, res) => {
  res.json({ message: 'yo, sup dude' });
});

app.use(ui(port, cacheStore));

app.listen(port, (error) => {
  if (error) {
    winston.error(error);
  } else {
    winston.info(`Monty proxy: http://localhost:${port}/`);
  }
});

app.listen(fakeServerPort, (error) => {
  if (error) {
    winston.error(error);
  } else {
    winston.info(`Fake server: http://localhost:${fakeServerPort}/`);
  }
});
