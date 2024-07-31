/**
 * Example of a generic route with more programability options e.g.:
 * - Checking for an API Key
 * - Changing the path
 */ 

const express = require('express');
const proxy = require('express-http-proxy');
const router = express.Router();

router.use('/', proxy(process.env.PROXY_SVC1_URL, {
  proxyReqPathResolver: function (req) {
    let url = req.url;
    console.log("[PROXY]", "PICSUM", req.method, url);
    url = req.path; // Remove querystring parameters or whatever...
    return url;
  },
  filter: function(req, res) {
    const APIKeyRequired = process.env.PROXY_SVC1_API_KEY_REQUIRED;
    if (APIKeyRequired && req.header('x-api-key') !== APIKeyRequired) return false;
    return true;
 }
}));

module.exports = router;
