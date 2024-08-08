'use strict';

const express = require('express');

require('dotenv').config();

const config = require('./config.js');
process.env.DEBUG && console.debug(config);

const app = express();
app.use(require('body-parser').raw({type: 'text/xml'}));

app.use('/ping', (req, res) => {
  res.send(`OK: ${new Date().toLocaleString()}`);
});

config.port && app.listen(config.port, () => {
  console.log(`Proxy Service (PID ${process.pid}) ready http://127.0.0.1:${config.port}/`);
  loadRoutes();
});

if (config.ssl?.port) {
  const credentials = {
    key: config.ssl.key,
    cert: config.ssl.certificate,
  };
  const https = require('https');
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(config.ssl.port, () => {
    console.log(`Proxy Service (PID ${process.pid}) ready https://127.0.0.1:${config.ssl.port}/`);
    loadRoutes();
  });
}

let routesLoaded = false;
function loadRoutes() {
  const path = require('path');
  if (routesLoaded) return;
  app.use('/proxy', require('./routes/proxy'));
  if (config.staticPath) {
    app.use('/static', function(req, res, next) {
      req.method = 'GET';
      next();
    });
    app.use('/static', express.static(config.staticPath, {}));
  }
  app.use('/', express.static(path.join(__dirname, '/html'), {}));
  routesLoaded = true;
}
