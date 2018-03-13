import superagent from 'superagent';

import server from '../../src/server/servers';
import config from '../../src/server/config';

const runningServer = {};

describe('Mock api', () => {
  beforeEach(() =>
    server()
      .then(({ shutdown, stores }) => {
        Object.assign(runningServer, { shutdown, stores });
      }));

  beforeEach(() => runningServer.stores.mockedResponses.nuke());

  afterEach(() => runningServer.shutdown());

  it('creates a mock', () => {
    const responseBody = 'some response body';
    const url = 'some url';
    const proxyId = 1;
    const contentType = 'application/json';
    const httpMethod = 'get';
    return superagent.post(`http://localhost:${config.appPort}/api/bluffer/set-mock`)
      .send({
        responseBody,
        url,
        proxyId,
        contentType,
        httpMethod,
      })
      .then((res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.body.responseBody).toEqual(responseBody);
        expect(res.body.url).toEqual(url);
        expect(res.body.proxyId).toEqual(proxyId);
        expect(res.body.contentType).toEqual(contentType);
        expect(res.body.httpMethod).toEqual(httpMethod);
        expect(res.body.timestamp).toBeTruthy();
        return runningServer.stores.mockedResponses.findOne({ proxyId, url });
      })
      .then((savedMockedResponse) => {
        expect(savedMockedResponse.responseBody).toEqual(responseBody);
        expect(savedMockedResponse.url).toEqual(url);
        expect(savedMockedResponse.proxyId).toEqual(proxyId);
        expect(savedMockedResponse.contentType).toEqual(contentType);
        expect(savedMockedResponse.httpMethod).toEqual(httpMethod);
        expect(savedMockedResponse.timestamp).toBeTruthy();
      });
  });

  it('updates a mock', () => {
    const responseBody = 'some response body';
    const url = 'some url';
    const proxyId = 1;
    const contentType = 'application/json';
    const httpMethod = 'get';
    const updatedResponseBody = 'some updated response body';
    return superagent.post(`http://localhost:${config.appPort}/api/bluffer/set-mock`)
      .send({
        responseBody,
        url,
        proxyId,
        contentType,
        httpMethod,
      })
      .then(() => superagent.post(`http://localhost:${config.appPort}/api/bluffer/set-mock`)
        .send({
          responseBody: updatedResponseBody,
          url,
          proxyId,
          contentType,
          httpMethod,
        }))
      .then((res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.body.responseBody).toEqual(updatedResponseBody);
        expect(res.body.url).toEqual(url);
        expect(res.body.proxyId).toEqual(proxyId);
        expect(res.body.contentType).toEqual(contentType);
        expect(res.body.httpMethod).toEqual(httpMethod);
        expect(res.body.timestamp).toBeTruthy();
        return runningServer.stores.mockedResponses.find({ proxyId, url });
      })
      .then((savedMockedResponses) => {
        expect(savedMockedResponses).toHaveLength(1);
        expect(savedMockedResponses[0].responseBody).toEqual(updatedResponseBody);
        expect(savedMockedResponses[0].url).toEqual(url);
        expect(savedMockedResponses[0].proxyId).toEqual(proxyId);
        expect(savedMockedResponses[0].contentType).toEqual(contentType);
        expect(savedMockedResponses[0].httpMethod).toEqual(httpMethod);
        expect(savedMockedResponses[0].timestamp).toBeTruthy();
      });
  });
});
