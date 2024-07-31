# Proxy Service
This web service (not web) proxy will proxy requests to a downstream server.
This can be useful for debugging but also for live cases when a proxy is required.

## Basic URL Proxying
You can configure generic proxying from any path to any host simply by setting one or more environment variables starting with `PROXY_URL_`.

So, for example the following will proxy requests to `/proxy/postman` to:
```
PROXY_URL_POSTMAN=https://postman-echo.com
```
That means calling `http://localhost:8080/proxy/postman/get` is the same as calling `https://postman-echo.com/get`.

## Specialized Service Proxying
We offer the ability to define your own custom code for proxying. This allows you to modify the request/response in any way you like.

To do this you write your own expressJS (v4) route and save it to the directory you configure at `SERVICES_PATH`. See our `src/services/picsum.js` for an example which you can copy and customize.

For more info see the [express-http-proxy](https://www.npmjs.com/package/express-http-proxy) documentation.

## Ports
We offer HTTP and HTTPS and you can have both running at the same time.
If you configure HTTPS you need to supply your own keys. The .key and .crt files supplied are self-signed and will cause browser errors which you can ignore if you are just testing/developing.

## Configuration
The following environment variables can be configured:
* `HTTP_PORT`: The port on which this service listens (default `8080`)
* `HTTPS_PORT`: The port on which this service listens (no default). If set also provide:
  * `SSL_KEY`: Full path to private `.key` file for HTTPS (e.g. /home/me/ssl.key)
  * `SSL_CERTIFICATE`: Full paath to public `.crt` or `.pem` file for HTTPS (e.g. /home/me/ssl.crt)
* `SERVICES_PATH`: Path to custom services (default ./src/services/)
  * `PROXY_SVC_PICSUM`: Example proxy to https://picsum.photos/
  * `PROXY_SVC_PICSUM_API_KEY_REQUIRED`: Example of an API Key required for requests to this `/proxy/picsum` service. Must be supplied in `x-api-key` header. Default empty means header must be empty or not present.
* `PROXY_URL_ANYTHING`: Proxy `/proxy/anything/` to any URL defined in `PROXY_URL_ANYTHING`
* `PROXY_URL_ANYTHING_ELSE`: Proxy `/proxy/anything/else/` to any URL defined in `PROXY_URL_ANYTHING_ELSE` etc...