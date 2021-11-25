const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api/*',
        createProxyMiddleware({
            target: 'http://127.0.0.1:9000',
            changeOrigin: true,
            pathRewrite: {
                '^/api/': '/',
                '^/api/verifyadmin': '/verifyadmin',
                '^/api/verifyuser': '/verifyuser',
                '^/api/addRoomAdmin': '/addRoomAdmin',
                '^/api/updateroomadmin': '/updateroomadmin',
                '^/api/getRoomAdmin': '/getRoomAdmin',
                '^/api/getNotification': '/getNotification',
            },
        })
    );
};
