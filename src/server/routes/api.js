import express from 'express';
import winston from 'winston';
import bodyParser from 'body-parser';

export default (dataStore, io) => {
  const router = express.Router();

  router.use('*', bodyParser.json({ limit: '5mb' }));

  router.post('/log-nock-response', (req, res) => {
    const { url, responseBody } = req.body;
    winston.debug(`Logging nock response ${url}`);
    const loggedResponse = dataStore.logResponse(req.originalUrl, String(responseBody), req.headers.host);
    io.emit('request_proxied', loggedResponse);
    res.sendStatus(201);
  });

  router.get('/get-mock-response', (req, res) => {
    winston.debug(`Getting mock response ${req.query.url}`);
    const mockResponse = dataStore.getMock(req.query.url);
    if (!mockResponse) {
      return res.sendStatus(404);
    }
    res.json(mockResponse.responseBody);
  });

  router.post('/set-proxy-response', (req, res) => {
    const { url, responseBody } = req.body;
    winston.debug(`Setting proxy response ${url}`);

    const mockedResponse = dataStore.mockResponse(url, responseBody);
    res.json(mockedResponse);
  });

  router.post('/delete-proxy-response', (req, res) => {
    const { url } = req.body;
    winston.debug(`Deleting proxy response ${url}`);

    dataStore.deleteMock(url);
    res.sendStatus(202);
  });

  router.post('/delete-all-logs', (req, res) => {
    winston.debug('Deleting all logged responses');

    dataStore.deleteAllLogs();
    res.sendStatus(202);
  });

  router.post('/delete-all-mocks', (req, res) => {
    winston.debug('Deleting all mocked responses');

    dataStore.deleteAllMocks();
    res.sendStatus(202);
  });

  return router;
};
