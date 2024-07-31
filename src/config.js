const fs = require('fs');

const services = {};
Object.keys(process.env)
  .filter(k => k.match(/^PROXY_SVC_.+_URL$/))
  .forEach(e => (services[e.replace(/^PROXY_SVC_/, '').replace(/_URL$/, '').toLowerCase()] = process.env[e]));
  
  const urls = {};
Object.keys(process.env)
  .filter(k => k.match(/^PROXY_URL_/))
  .forEach(e => (urls[e.replace(/^PROXY_URL_/, '').toLowerCase()] = process.env[e]));

const config = {
  ssl: process.env.HTTPS_PORT ? {
    port: process.env.HTTPS_PORT,
    key: process.env.SSL_KEY,
    certificate: process.env.SSL_CERTIFICATE,
  } : undefined,
  port: process.env.HTTP_PORT || '8080',
  servicesPath: process.env.SERVICES_PATH || './src/services/',
  services,
  urls,
};

if (config.ssl && !fs.existsSync(config.ssl.key)) throw new Error(`File SSL_KEY not found at '${config.ssl.key}'`);
else config.ssl.key = fs.readFileSync(config.ssl.key, 'utf8');
if (config.ssl && !fs.existsSync(config.ssl.certificate)) throw new Error(`File SSL_CERTIFICATE not found at '${config.ssl.certificate}'`);
else config.ssl.certificate = fs.readFileSync(config.ssl.certificate, 'utf8')

if (!fs.existsSync(config.servicesPath)) throw new Error(`Directory SERVICES_PATH not found at '${config.servicesPath}'!`);

module.exports = config;