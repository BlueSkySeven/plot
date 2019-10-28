const os = require('os');
/**
 * 代理ip
 */
const PROXY_CONFIG = [
    {
        context: [
            "/api",
            "/schema",
            "/auth",
            "/chart"
        ],
        target: "http://192.168.21.46:3000",
        secure: false,
        logLevel: "debug",
        changeOrigin: true
    }
]

module.exports = PROXY_CONFIG;