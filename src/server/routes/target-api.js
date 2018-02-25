import express from 'express';
import bodyParser from 'body-parser';
import superagent from 'superagent';

const quotes = [
  'Progress is man\'s ability to complicate simplicity.',
  'Always remember that you are absolutely unique. Just like everyone else.',
  'People who think they know everything are a great annoyance to those of us who do.',
  'Behind every great man is a woman rolling her eyes.',
  'I\'m sorry, if you were right, I\'d agree with you.',
];

const randomQuote = () => {
  const randomId = Math.round(Math.random() * (quotes.length - 1));
  return quotes[randomId];
};

export default () => {
  const router = express.Router();

  router.use(bodyParser.json());

  router.get('/google', (req, res) => {
    superagent('http://google.com')
      .then(({ text }) => {
        res.send(text);
      });
  });

  router.post('*', (req, res) => {
    setTimeout(() => res.json({ message: 'Thank you for posting!' }), 200);
  });

  router.get('*', (req, res) => {
    setTimeout(() => res.json({ message: randomQuote() }), 200);
  });

  return router;
};
