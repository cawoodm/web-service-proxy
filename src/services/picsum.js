/**
 * Example of a generic route with more programability options e.g.:
 * - Checking for an API Key
 * - Changing the path
 */

'use strict';

const name = 'PICSUM';

module.exports = {
  parseReqBody: false,
  proxyReqPathResolver: function (req) {
    // Strip querystring from req.url
    return req.path;
  },
  proxyReqBodyDecorator: function(body, req) {
    if (process.env.LOG_REQUEST) {
      console.log('[PROXY]', '[REQ]', name, req.method, req.url);
      console.log('-------------------------------REQ.HEADERS-----------------------------------------');
      console.log(req.headers);
      console.log('-------------------------------REQ.BODY-----------------------------------------');
      console.log(req.body.toString());
    }
    return body;
  },
  userResDecorator: function(proxyRes, proxyResData, userReq, userRes) {
    if (process.env.LOG_RESPONSE) {
      console.log('[PROXY]', '[RES]', name, userRes.statusCode);
      console.log('-------------------------------RES.HEADERS-----------------------------------------');
      console.log(proxyRes.headers);
      console.log('-------------------------------RES.BODY-----------------------------------------');
      const body = proxyResData.toString();
      console.log(body);
    }
    let data = JSON.parse(proxyResData.toString('utf8'));
    data.newProperty = 'exciting data';
    return JSON.stringify(data);
  },
  filter: function(req, res) {
    const APIKeyRequired = process.env.PROXY_SVC_PICSUM_API_KEY_REQUIRED;
    if (APIKeyRequired && req.header('x-api-key') !== APIKeyRequired) return false;
    return true;
  },
};
