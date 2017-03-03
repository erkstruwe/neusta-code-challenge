const os = require('os')

let config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    concurrency: os.cpus().length
}

config.baseUrl = 'http://localhost:' + config.port

module.exports = config
