import express from 'express';
import httpProxy from 'http-proxy';
import winston from 'winston';
import transformerProxy from 'transformer-proxy';

const proxy = httpProxy.createProxyServer({ secure: false });

export default (cacheStore, proxyConfig, io) => {
  const router = express.Router();

  router.use('*', transformerProxy((data, req) => {
    const response = cacheStore.setCachedResponse(req.originalUrl, String(data));
    io.emit('request-proxied', { url: req.originalUrl, response });
    return data;
  }));

  proxy.on('proxyRes', (proxyRes, req, res) => {
    res.setHeader('X-Bluffer-Proxy', 'bluffer-proxy');
  });

  proxy.on('error', (err) => {
    winston.error('Proxy Error', err);
  });

  proxy.on('proxyReq', (proxyReq, req, /* res, options */) => {
    winston.debug(`Processing request ${req.originalUrl}`);
    proxyReq.setHeader('Host', proxyConfig.host);
    winston.debug(`Original request headers ${req.headers}`);
  });

  router.get('*', (req, res) => {
    const url = req.originalUrl;
    if (!cacheStore.getSavedResponse(url)) {
      winston.debug(`Proxying request for url ${url}`);
      return proxy.web(req, res, { target: proxyConfig.target });
    }
    winston.debug(`Using saved response for url ${url}`);
    const responseBody = cacheStore.getSavedResponse(url);
    res.json(JSON.parse(responseBody));
  });

  return router;
};
