import express from 'express';
import { get, split, first } from 'lodash';
import superagent from 'superagent';
import winston from 'winston';

import logger from '../logger';

export default ({
  proxyConfig: {
    port: proxyId,
    target: proxyTarget,
    offline,
  },
  socketIo,
  stores: {
    mockedResponses,
    proxiedResponses,
  },
}) => {
  const router = express.Router();

  const getAndFollowRedirect = (location, cookie = {}) => {
    logger.info(`Following redirect ${location} ${JSON.stringify(cookie)}`);
    return superagent(location)
      .set('monty', 'true')
      .set('Accept-encoding', 'gzip, deflate')
      .set('cookie', cookie)
      .then((res) => {
        if (res.statusCode === 302 || res.statusCode === 304) {
          return getAndFollowRedirect(res.headers.location, { ...cookie, ...res.headers.cookie });
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
      res.setHeader('Content-Type', 'text/css');
      res.send(mock.responseBody);
    } catch (err) {
      logger.warn('Unable parse JSON response, sending as plain text instead', err);
      res.send(mock.responseBody);
    }
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
    proxiedResponses.save({
      proxyId,
      url: req.originalUrl,
      responseBody,
      client: req.headers.host,
      httpMethod,
      contentType,
    }).then((emitRequestProxiedEvent));
  };

  const getContentType = (contentTypeHeader) => first(split(get(contentTypeHeader, 'headers.accept', 'application/json'), ',', 1));

  const formatResponse = (responseBody, contentType) => {
    if (contentType === 'application/json') {
      try {
        return JSON.stringify(JSON.parse(responseBody), null, 2);
      } catch (err) {
        return responseBody;
      }
    }
    return responseBody;
  };

  const sendProxyResponse = (res, responseBody, contentType) => {
    if (contentType === 'application/json') {
      try {
        return res.json(JSON.parse(responseBody));
      } catch (err) {
        logger.warn(`Content type is ${contentType} but body is not valid JSON, falling back on empty body ${responseBody.substring(0, 20)}`, err);
        return res.json({});
      }
    }
    return res.send(responseBody);
  };

  const proxyRequest = (req, res, httpMethod) => {
    logger.debug(`Proxying request for url ${req.originalUrl} to target ${proxyTarget} with HTTP method GET`, req.headers.cookie);
    // TODO headers?
    // proxyReq.setHeader('Host', proxyHost);
    // proxyReq.setHeader('Cookie', 'monty=true');
    // proxyReq.setHeader('accept-encoding', 'identity');
    return getAndFollowRedirect(`${proxyTarget}${req.originalUrl}`)
      .then((proxyRes) => {
        const contentType = getContentType(proxyRes.headers['content-type']);
        logger.debug(`Received proxy response with status code ${proxyRes.statusCode} and content type ${contentType}`);

        handleProxyResponse({
          responseBody: formatResponse(proxyRes.text, contentType),
          req,
          httpMethod,
          contentType,
        });

        return sendProxyResponse(res, proxyRes.text, contentType);
      });
  };

  const serveProxiedResponse = (req, res, httpMethod) => {
    const url = req.originalUrl;
    logger.debug(`Attempting to serve log for url ${url}`);
    return proxiedResponses.findOne({ proxyId, url })
      .then((log) => {
        if (log) {
          logger.debug(`Using log response for url ${url} and HTTP method ${httpMethod}`);
          sendMockResponse(url, res, log);
        }
        if (!log) {
          logger.warn(`Unable to serve log for url ${url}, falling back on proxy`);
          return proxyRequest(req, res, httpMethod);
        }
      });
  };

  const handleRequest = (req, res, httpMethod) => {
    const url = req.originalUrl;
    return mockedResponses.findOne({ proxyId, url })
      .then((mock) => {
        if (!mock) {
          return offline ? serveProxiedResponse(req, res, httpMethod) : proxyRequest(req, res, httpMethod);
        }

        logger.debug(`Using mock response for url ${url} and HTTP method ${httpMethod}`);
        sendMockResponse(url, res, mock);
        socketIo.emit('mock_served', { url, proxyId, httpMethod });
      })
      .catch((err) => {
        winston.error('Unable to handle proxy request', err);
        res.send(err);
      });
  };

  router.get('/favicon.ico', (req, res) => {
    res.sendStatus(200);
  });

  router.get('*', (req, res) => {
    handleRequest(req, res, 'GET');
  });

  router.post('*', (req, res) => {
    handleRequest(req, res, 'POST');
  });

  return router;
};
