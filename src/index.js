const throng = require('throng')

const config = require('./config')
const logger = require('./logger')
const server = require('./server')

throng({
    workers: config.concurrency,
    start: (id) => {
        return server().listen(
            config.port,
            () => {
                logger.info('web worker ' + id + ' listening on port ' + config.port)
            }
        )
    }
})
