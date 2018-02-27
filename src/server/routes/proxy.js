import express from 'express';
import httpProxy from 'http-proxy';
import { get } from 'lodash';
import superagent from 'superagent';
import zlib from 'zlib';

import logger from '../logger';

export default ({ dataStore, proxyConfig: { port: proxyId, target: proxyTarget, host: proxyHost }, socketIo }) => {
  const router = express.Router();

  const proxy = httpProxy.createProxyServer({ secure: false, changeOrigin: true });

  const followRedirect = (location, cookie) => {
    logger.info(`Following redirect ${location} ${cookie}`);
    return superagent(location)
      .set('monty', 'monty')
      .set('Accept-encoding', 'gzip, deflate')
      .set('cookie', cookie)
      .then((res) => {
        if (res.statusCode === 302 || res.statusCode === 304) {
          return followRedirect(res.headers.location, { ...cookie, ...res.headers.cookie });
        }
        return res;
      });
  };

  const sendMockResponse = (url, res, mock) => {
    res.type(mock.contentType);
    if (mock.contentType !== 'application/json') {
      return res.send(mock.responseBody);
    }
    try {
      res.json(JSON.parse(mock.responseBody));
    } catch (err) {
      logger.warn('Unable parse JSON response, sending as plain text instead', err);
      res.send(mock.responseBody);
    }
  };

  const handleGzipResponse = (url, proxyRes) => {
    logger.debug(`Handling GZIP response from URL ${url}`);
    const gunzip = zlib.createGunzip();
    proxyRes.pipe(gunzip);

    const buffer = [];

    return new Promise((resolve) => {
      gunzip.on('data', (data) => {
        buffer.push(data.toString());
      }).on('end', () => {
        resolve(String(buffer));
      }).on('error', (err) => {
        logger.error(`Unable to unzip response from URL ${url}`, err);
        resolve('GZIP error');
      });
    });
  };

  const emitRequestProxiedEvent = (loggedResponse) => {
    socketIo.emit('request_proxied', { loggedResponse, proxyId });
  };

  const handleProxyResponse = ({
    responseBody,
    contentType,
    httpMethod,
    req,
  }) => {
    const formatResponse = () => {
      if (contentType !== 'application/json') {
        return responseBody;
      }
      try {
        return JSON.stringify(JSON.parse(responseBody), null, 2);
      } catch (err) {
        logger.warn(`Unable to parse response body for URL ${proxyTarget}${req.originalUrl}: ${responseBody.substring(0, 30)}`, err);
        return responseBody;
      }
    };
    const loggedResponse = dataStore.logResponse({
      proxyId,
      url: req.originalUrl,
      responseBody: formatResponse(),
      client: req.headers.host,
      httpMethod,
      contentType,
    });
    emitRequestProxiedEvent(loggedResponse);
  };

  proxy.on('proxyRes', (proxyRes, req, res) => {
    res.setHeader('X-Bluffer-Proxy', 'bluffer-proxy');

    logger.debug(`Proxy response ${proxyTarget}${req.originalUrl}`);

    const { originalUrl: url } = req;
    const httpMethod = get(proxyRes, 'client._httpMessage.method');
    const contentType = get(req, 'headers.accept', 'application/json');

    if (proxyRes.statusCode > 200 && !proxyRes.statusCode === 302 && proxyRes.statusCode === 304) {
      logger.warn(`Error received from target API from target ${proxyTarget}: ${proxyRes.statusCode}`);
      return handleProxyResponse({
        responseBody: `Error ${proxyRes.statusCode}`,
        contentType: 'text/plain',
        req,
        httpMethod,
      });
    }

    if (proxyRes.headers['content-encoding'] === 'gzip') {
      return handleGzipResponse(url, proxyRes)
        .then((responseBody) =>
          handleProxyResponse({
            responseBody,
            contentType,
            req,
            httpMethod,
          }));
    }

    if (proxyRes.statusCode === 302) {
      return followRedirect(proxyRes.headers.location, req.headers.cookie)
        .then(({ body, headers }) => {
          logger.debug(`Redirect returned ${body}`);
          handleProxyResponse({
            responseBody: res,
            req,
            httpMethod,
            contentType: headers['content-type'],
          });
        });
    }

    let responseBody = '';
    proxyRes.on('data', (data) => {
      responseBody += data.toString('utf-8');
    });
    proxyRes.on('end', () => {
      setTimeout(() => {
        handleProxyResponse({
          responseBody: proxyRes.statusCode !== 404 ? responseBody : 'Not Found',
          req,
          httpMethod,
          contentType: proxyRes.statusCode !== 404 ? contentType : 'text/plain',
        });
      }, 500);
    });
  });

  proxy.on('error', (err) => {
    logger.error(`Proxy Error from target ${proxyTarget}`, err);
  });

  proxy.on('proxyReq', (proxyReq, req, /* res, options */) => {
    logger.debug(`Processing request ${req.originalUrl}`);
    logger.debug(`Setting Host Header to ${proxyHost}`);
    proxyReq.setHeader('Host', proxyHost);
    proxyReq.setHeader('Cookie', 'monty=true');
    proxyReq.setHeader('Accept-encoding', 'gzip, deflate');
  });

  const handleRequest = (req, res, httpMethod) => {
    const url = req.originalUrl;
    const mock = dataStore.getMock(proxyId, url);
    if (!mock) {
      logger.debug(`Proxying request for url ${url} to target ${proxyTarget} with HTTP method GET`);
      return proxy.web(req, res, { target: proxyTarget });
    }

    logger.debug(`Using mock response for url ${url} and HTTP method GET`);
    sendMockResponse(url, res, mock);
    socketIo.emit('mock_served', { url, proxyId, httpMethod });
  };

  router.get('*', (req, res) => {
    handleRequest(req, res, 'GET');
  });

  router.post('*', (req, res) => {
    handleRequest(req, res, 'POST');
  });

  return router;
};
