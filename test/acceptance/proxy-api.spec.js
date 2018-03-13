import superagent from 'superagent';

import server from '../../src/server/servers';

const runningServer = {};

describe('Proxy api', () => {
  beforeAll(() =>
    server()
      .then(({ shutdown, stores }) => {
        Object.assign(runningServer, { shutdown, stores });
      }));

  beforeEach(() => Promise.all([runningServer.stores.mockedResponses.nuke(), runningServer.stores.proxiedResponses.nuke()]));

  afterAll(() => runningServer.shutdown());

  it('proxies a get request', () => {
    const url = '/proxy-this';
    const proxyId = 3001;
    return superagent.get(`http://localhost:3001${url}`)
      .then((res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.text).toBeTruthy();
        return runningServer.stores.proxiedResponses.findOne({ proxyId, url })
          .then((savedProxiedResponse) => {
            expect(savedProxiedResponse.responseBody).toEqual(JSON.stringify(JSON.parse(res.text), null, 2));
            expect(savedProxiedResponse.url).toEqual(url);
            expect(savedProxiedResponse.proxyId).toEqual(proxyId);
            expect(savedProxiedResponse.contentType).toEqual('application/json');
            expect(savedProxiedResponse.httpMethod).toEqual('GET');
            expect(savedProxiedResponse.timestamp).toBeTruthy();
          });
      });
  });
});
