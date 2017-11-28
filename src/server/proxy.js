import express from 'express';
import httpProxy from 'http-proxy';
import winston from 'winston';

const proxy = httpProxy.createProxyServer({});

export default (cacheStore) => {
  const router = express.Router();

  proxy.on('proxyRes', (proxyRes, req, res) => {
    res.setHeader('X-Monty-Proxy', 'monty-proxy');
    cacheStore.setCachedResponse(req.originalUrl, '');
    proxyRes.on('data', (data) => {
      // winston.debug(`processing data ${data}`);
      cacheStore.setCachedResponse(req.originalUrl, `${cacheStore.getCachedResponse(req.originalUrl)}${data.toString('utf-8')}`);
    });
  });

  proxy.on('proxyReq', (proxyReq, req, /* res, options */) => {
    winston.debug(`Processing request ${req.originalUrl}`);
    proxyReq.setHeader('Host', 'ebt.api.arcadiagroup.co.uk');
    winston.debug(`original request headers ${req.headers}`);
  });

  router.get('*', (req, res) => {
    const url = req.originalUrl;
    if (!cacheStore.getSavedResponse(url)) {
      winston.debug(`Proxying request for url ${url}`);
      return proxy.web(req, res, { target: 'http://ebt.api.arcadiagroup.co.uk/api' });
    }
    winston.debug(`Using saved response for url ${url}`);
    const responseBody = cacheStore.getSavedResponse(url);
    res.json(JSON.parse(responseBody));
  });

  router.post('/proxy-response', (req, res) => {
    const { url, response } = req.body;

    cacheStore.setSavedResponse(url, response);
    res.sendStatus(202);
  });

  return router;
};
