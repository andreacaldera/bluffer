import express from 'express';
import winston from 'winston';

export default (cacheStore) => {
  const router = express.Router();

  router.post('/set-proxy-response', (req, res) => {
    const { url, response } = req.body;
    winston.debug(`Setting proxy response ${url}`);

    cacheStore.setSavedResponse(url, response);
    res.sendStatus(202);
  });

  router.post('/delete-proxy-response', (req, res) => {
    const { url } = req.body;
    winston.debug(`Deleting proxy response ${url}`);

    cacheStore.deleteResponse(url);
    res.sendStatus(202);
  });


  return router;
};
