import express from 'express';
import bodyParser from 'body-parser';

import logger from '../logger';

export default ({ mockResonseStore }) => {
  const router = express.Router();

  router.use('*', bodyParser.json({ limit: '5mb' }));

  router.get('/get-mock-response', (req, res) => {
    logger.debug(`Getting mock response ${req.query.selectedProxy} ${req.query.url}`);
    mockResonseStore.findOne({ proxyId: req.query.selectedProxy, url: req.query.url })
      .then((mock) => {
        if (!mock) {
          return res.sendStatus(404);
        }
        res.json(mock.responseBody);
      });
  });

  router.post('/set-mock', (req, res) => {
    const {
      proxyId,
      url,
      responseBody,
      httpMethod,
      contentType,
    } = req.body;
    logger.debug(`Setting proxy response ${proxyId} ${url}`);

    mockResonseStore.save({
      proxyId,
      url,
      responseBody,
      httpMethod,
      contentType,
    })
      .then((mock) => {
        res.json(mock);
      });
  });

  router.post('/delete-mock', (req, res) => {
    const { url, proxyId } = req.body;
    logger.debug(`Deleting proxy response ${proxyId} ${url}`);

    // TODO deleteMock(proxyId, url);
    res.sendStatus(202);
  });

  router.post('/delete-all-logs', (req, res) => {
    const { proxyId } = req.body;
    logger.debug(`Deleting all logged responses for proxy ${proxyId}`);

    // TODO deleteAllLogs(proxyId);
    res.sendStatus(202);
  });

  router.post('/delete-all-mocks', (req, res) => {
    const { proxyId } = req.body;
    logger.debug(`Deleting all mocked responses ${proxyId}`);

    // TODO deleteAllMocks(proxyId);
    res.sendStatus(202);
  });

  return router;
};
