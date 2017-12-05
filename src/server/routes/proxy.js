import express from 'express';
import httpProxy from 'http-proxy';
import winston from 'winston';

const proxy = httpProxy.createProxyServer({ secure: false, changeOrigin: true });

export default (dataStore, proxyConfig, io) => {
  const router = express.Router();

  proxy.on('proxyRes', (proxyRes, req, res) => {
    res.setHeader('X-Bluffer-Proxy', 'bluffer-proxy');

    let responseBody = '';
    proxyRes.on('data', (data) => {
      responseBody += data.toString('utf-8');
    });

    proxyRes.on('end', () => {
      setTimeout(() => {
        if (proxyRes.statusCode > 200) {
          winston.warn(`Error received from target API: ${proxyRes.statusCode} ${String(responseBody)}`);
          return;
        }

        const loggedResponse = dataStore.logResponse(req.originalUrl, String(responseBody), req.headers.host);
        io.emit('request_proxied', loggedResponse);
      }, 500);
    });
  });

  proxy.on('error', (err) => {
    winston.error('Proxy Error', err);
  });

  proxy.on('proxyReq', (proxyReq, req, /* res, options */) => {
    winston.debug(`Processing request ${req.originalUrl}`);
    winston.debug(`Setting Host Header to ${proxyConfig.host}`);
    proxyReq.setHeader('Host', proxyConfig.host);
    //Monty CMS complains about a bad cookie.
    proxyReq.setHeader('cookie', '');
  });

  router.get('*', (req, res) => {
    const url = req.originalUrl;
    const mock = dataStore.getMock(url);
    if (!mock) {
      winston.debug(`Proxying request for url ${url}`);
      winston.debug(`Targetting proxy to ${proxyConfig.target}`);
      return proxy.web(req, res, { target: proxyConfig.target });
    }

    winston.debug(`Using mock response for url ${url}`);
    try {
      res.json(JSON.parse(mock.responseBody));
    } catch (err) {
      res.send(mock.responseBody);
    }
    io.emit('mock_served', { url });
  });

  return router;
};
