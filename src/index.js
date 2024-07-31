const express = require('express');
//const morgan = require('./config/morgan');
//const { jwtStrategy } = require('./config/passport');

require('dotenv').config()

const config = require('./config.js');
console.debug(config)

const app = express();

// app.use(express.json());

app.use('/ping', (req, res) => {
  res.send(`OK: ${new Date().toLocaleString()}`);
});

config.port && app.listen(config.port, () => {
  console.log(`Proxy Service (PID ${process.pid}) ready http://127.0.0.1:${config.port}/`)
  loadRoutes();
});

if (config.ssl?.port) {
  const credentials = {
    key: config.ssl.key,
    cert: config.ssl.certificate,
  };
  const https = require('https');
  httpsServer = https.createServer(credentials, app);
  httpsServer.listen(config.ssl.port, () => {
    console.log(`Proxy Service (PID ${process.pid}) ready https://127.0.0.1:${config.ssl.port}/`)
    loadRoutes();
  });
}

let routesLoaded=false;
function loadRoutes() {
  const path = require('path');
  if (routesLoaded) return;
  app.use('/proxy', require('./routes/proxy'));
  app.use('/', express.static(path.join(__dirname, '/html'), {}));
  routesLoaded = true;
}