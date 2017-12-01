import express from 'express';
import httpProxy from 'http-proxy';
import winston from 'winston';

const proxy = httpProxy.createProxyServer({ secure: false });

export default (dataStore, proxyConfig, io) => {
  const router = express.Router();

  proxy.on('proxyRes', (proxyRes, req, res) => {
    res.setHeader('X-Bluffer-Proxy', 'bluffer-proxy');

    res.setHeader('X-Bluffer-Proxy', 'bluffer-proxy');
    res.setHeader('X-Bluffer-Proxy', 'bluffer-proxy');
    let responseBody = '';
    proxyRes.on('data', (data) => {
      responseBody += data.toString('utf-8');
    });

    proxyRes.on('end', () => {
      setTimeout(() => {
        const loggedResponse = dataStore.logResponse(req.originalUrl, String(responseBody));
        if (proxyRes.statusCode > 200) {
          winston.warn(`Error received from target API: ${proxyRes.statusCode}`);
        }
        // winston.debug('Proxied response', loggedResponse);
        io.emit('request-proxied', loggedResponse);
      }, 500);
    });
  });

  proxy.on('error', (err) => {
    winston.error('Proxy Error', err);
  });

  proxy.on('proxyReq', (proxyReq, req, /* res, options */) => {
    winston.debug(`Processing request ${req.originalUrl}`);
    proxyReq.setHeader('Host', proxyConfig.host);
  });

  router.get('*', (req, res) => {
    const url = req.originalUrl;
    const mock = dataStore.getMock(url);
    if (!mock) {
      winston.debug(`Proxying request for url ${url}`);
      return proxy.web(req, res, { target: proxyConfig.target });
    }

    winston.debug(`Using mock response for url ${url}`);
    res.locals.skipTransform = true;
    res.json(JSON.parse(mock.responseBody));
    io.emit('mock_served', { url });
  });

  return router;
};
