import superagent from 'superagent';
import nock from 'nock';

describe('Proxy sagas', () => {
  it('test nock', () => {
    nock('http://localhost:5002')
      .get('/')
      .reply(200, { message: 'Hey!' })
      .persist();

    return superagent('http://localhost:5002')
      .then(({ body }) => console.log('body', body));
  });
});
