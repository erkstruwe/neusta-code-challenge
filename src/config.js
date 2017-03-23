let config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    routing: {
        caseSensitive: true,
        strict: true
    }
}

config.baseUrl = 'http://localhost:' + config.port

module.exports = config
