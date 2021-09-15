const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/open-api/upload_static_file',
    createProxyMiddleware({
      target: 'http://lite.knx.com',
      changeOrigin: true,
    })
  );
  app.use(
    '/upload_assets',
    createProxyMiddleware({
      target: 'http://lite.knx.com',
      changeOrigin: true
    })
  );
};
