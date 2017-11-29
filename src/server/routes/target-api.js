import express from 'express';
import bodyParser from 'body-parser';

const quotes = [
  'Progress is man\'s ability to complicate simplicity.',
  'Always remember that you are absolutely unique. Just like everyone else.',
  'People who think they know everything are a great annoyance to those of us who do.',
  'Behind every great man is a woman rolling her eyes.',
  'I\'m sorry, if you were right, I\'d agree with you.',
];

const randomQuote = () => {
  const randomId = Math.round(Math.random() * (quotes.length - 0));
  return quotes[randomId];
};

export default () => {
  const router = express.Router();

  router.use('*', bodyParser.json());

  router.post('*', (req, res) => {
    setTimeout(() => res.json({ message: randomQuote() }), 200);
  });

  router.get('*', (req, res) => {
    setTimeout(() => res.json({ message: randomQuote() }), 200);
  });

  return router;
};
