const express = require('express');
//const morgan = require('./config/morgan');
//const { jwtStrategy } = require('./config/passport');

require('dotenv').config()

const fs = require('fs');
const PATH = require('path');

const config = require('./config.js');
console.debug(config)

const app = express();

// app.use(express.json());

app.use('/ping', (req, res) => {
  res.send(`OK: ${new Date().toLocaleString()}`);
});

config.port && app.listen(config.port, () => {
  console.log(`Proxy Service ready http://127.0.0.1:${config.port}/`)
  loadRoutes();
});

if (config.ssl?.port) {
  const fs = require('fs');
  if (!fs.existsSync(config.ssl.key)) throw new Error(`File SSL_KEY not found at '${config.ssl.key}'`);
  if (!fs.existsSync(config.ssl.certificate)) throw new Error(`File SSL_CERTIFICATE not found at '${config.ssl.certificate}'`);
  const credentials = {
    key: fs.readFileSync(config.ssl.key, 'utf8'),
    cert: fs.readFileSync(config.ssl.certificate, 'utf8')
  };
  const https = require('https');
  httpsServer = https.createServer(credentials, app);
  httpsServer.listen(config.ssl.port, () => {
    console.log(`Proxy Service ready https://127.0.0.1:${config.ssl.port}/`)
    loadRoutes();
  });
}

let routesLoaded=false;
function loadRoutes() {
  if (routesLoaded) return;
  app.use('/proxy', require('./routes/proxy'));
  app.use('/', (req, res) => {
    const indexHTML = fs.readFileSync(PATH.join(__dirname, './html/index.html')).toString();
    res.send(indexHTML);
  });
  routesLoaded = true;
}