'use strict';

const express = require('express');
const proxy = require('express-http-proxy');
const router = express.Router();
const fs = require('fs');
const PATH = require('path');
const config = require('../../config.js');

if (Object.keys(config.services).length) {
  console.log('Creating Services:');
  Object.keys(config.services).forEach(name => {
    const code = name.toUpperCase();
    const path = config.servicesPath + name + '.js';
    if (!fs.existsSync(path)) throw new Error(`Service ${code} not found at '${path}'!`);
    const baseUrl = config.services[name];
    console.log(` * Service Proxy (${name}) to ${baseUrl}`);
    router.use(`/${name}`, proxy(baseUrl, require(path)));
  });
} else {
  console.log('Note: No Services found!. Consider configuring SERVICES_PATH and PROXY_SVC_SOME_URL to add some');
}

if (Object.keys(config.urls).length) {
  console.log('Creating URLs:');
  Object.keys(config.urls).forEach(name => {
    const path = '/' + name.replace(/_/g, '/');
    const baseUrl = config.urls[name];
    console.log(` * Proxy (${path}) to ${baseUrl}`);
    router.use(path, proxy(baseUrl, {
      proxyReqPathResolver: function (req) {
        console.log('[PROXY]', '[REQ]', name, req.method, req.url);
        console.log('[PROXY]', '[REQ:HEADERS]', name, req.headers);
        return req.url;
      },
      userResDecorator: function(proxyRes, proxyResData, userReq, userRes) {
        console.log('[PROXY]', '[RES]', name, userRes.statusCode);
        console.log('[PROXY]', '[RES:HEADERS]', name, proxyRes.headers);
        console.log('[PROXY]', '[RES:DATA]', name, proxyResData.toString());
        return proxyResData;
      },
    }));
  });
} else {
  console.log('Note: No URLs found!. Consider configuring SERVICES_PATH and PROXY_URL_SOMETHING to add some');
}

const proxyHTML = fs.readFileSync(PATH.join(__dirname, '../../html/proxy.html')).toString();
router.use('/', (req, res) => {
  let html = proxyHTML;
  let services = Object.keys(config.services).map(name => {
    const baseUrl = config.services[name];
    const path = '/' + name.replace(/_/g, '/');
    return `<li><a href=".${path}">${path}</a>: ${baseUrl}</li>`;
  }).join('\n');
  html = html.replace('${SERVICES}', services);
  let urls = Object.keys(config.urls).map(name => {
    const path = '/' + name.replace(/_/g, '/');
    const baseUrl = config.urls[name];
    return `<li><a href=".${path}">${path}</a>: ${baseUrl}</li>`;
  }).join('\n');
  html = html.replace('${URLS}', urls);
  res.send(html);
});

module.exports = router;
