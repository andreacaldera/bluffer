import express from 'express';
import httpProxy from 'http-proxy';
import winston from 'winston';
import { get } from 'lodash';

export default ({ dataStore, proxyConfig, socketIo }) => {
  const router = express.Router();

  const proxy = httpProxy.createProxyServer({ secure: false, changeOrigin: true });

  const sendMockResponse = (url, res, mock) => {
    res.type(mock.contentType);
    if (mock.contentType !== 'application/json') {
      return res.send(mock.responseBody);
    }
    try {
      res.json(JSON.parse(mock.responseBody));
    } catch (err) {
      winston.warn('Unable parse JSON response, sending as plain text instead', err);
      res.send(mock.responseBody);
    }
  };

  proxy.on('proxyRes', (proxyRes, req, res) => {
    res.setHeader('X-Bluffer-Proxy', 'bluffer-proxy');

    let responseBody = '';
    proxyRes.on('data', (data) => {
      responseBody += data.toString('utf-8');
    });
    const httpMethod = get(proxyRes, 'client._httpMessage.method');
    const contentType = get(req, 'headers.accept', 'application/json');

    proxyRes.on('end', () => {
      setTimeout(() => {
        if (proxyRes.statusCode > 200 && !proxyRes.statusCode === 404) {
          winston.warn(`Error received from target API from target ${proxyConfig.target}: ${proxyRes.statusCode} ${String(responseBody)}`);
          return;
        }
        const loggedResponse = dataStore.logResponse({
          proxyId: proxyConfig.port,
          url: req.originalUrl,
          responseBody: proxyRes.statusCode !== 404 ? String(responseBody) : 'Not Found',
          client: req.headers.host,
          httpMethod,
          contentType,
        });
        socketIo.emit('request_proxied', { loggedResponse, proxyId: proxyConfig.port });
      }, 500);
    });
  });

  proxy.on('error', (err) => {
    winston.error(`Proxy Error from target ${proxyConfig.target}`, err);
  });

  proxy.on('proxyReq', (proxyReq, req, /* res, options */) => {
    winston.debug(`Processing request ${req.originalUrl}`);
    winston.debug(`Setting Host Header to ${proxyConfig.host}`);
    proxyReq.setHeader('Host', proxyConfig.host);
    proxyReq.setHeader('cookie', '');
    proxyReq.setHeader('accept-encoding', '');
  });

  router.get('/favicon.ico', (req, res) => {
    res.sendStatus(200);
  });

  router.get('*', (req, res) => {
    // TODO remove get / post duplication
    const url = req.originalUrl;
    const mock = dataStore.getMock(proxyConfig.port, url);
    if (!mock) {
      winston.debug(`Proxying request for url ${url} to target ${proxyConfig.target} with HTTP method GET`);
      return proxy.web(req, res, { target: proxyConfig.target });
    }

    winston.debug(`Using mock response for url ${url} and HTTP method GET`);
    sendMockResponse(url, res, mock);
    socketIo.emit('mock_served', { url, proxyId: proxyConfig.port, httpMethod: 'GET' });
  });

  router.post('*', (req, res) => {
    // TODO remove get / post duplication
    const url = req.originalUrl;
    const mock = dataStore.getMock(proxyConfig.port, url);
    if (!mock) {
      winston.debug(`Proxying request for url ${url} to target ${proxyConfig.target} with HTTP method POST`);
      return proxy.web(req, res, { target: proxyConfig.target });
    }

    winston.debug(`Using mock response for url ${url} and HTTP method POST`);
    sendMockResponse(url, res, mock);
    socketIo.emit('mock_served', { url, proxyId: proxyConfig.port, httpMethod: 'POST' });
  });

  return router;
};
