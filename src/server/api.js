import express from 'express';

export default (cacheStore) => {
  const router = express.Router();

  router.post('/proxy-response', (req, res) => {
    const { url, response } = req.body;

    cacheStore.setSavedResponse(url, response);
    res.sendStatus(202);
  });

  return router;
};
