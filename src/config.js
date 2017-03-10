let config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    // should be ~10,000 when using a real database
    batchSize: Infinity,
    routing: {
        caseSensitive: true,
        strict: true
    }
}

config.baseUrl = 'http://localhost:' + config.port

// should require('os').cpus().length for production when using a real database to start one web worker per cpu
config.concurrency = config.env === 'production' ? 1 : 1

module.exports = config
