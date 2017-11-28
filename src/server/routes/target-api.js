import express from 'express';
import bodyParser from 'body-parser';

export default () => {
  const router = express.Router();

  router.use('*', bodyParser.json());

  router.post('*', (req, res) => {
    res.json({ message: 'I am just a silly message' });
  });

  router.get('*', (req, res) => {
    res.json({ message: 'I am just a silly message' });
  });


  return router;
};
