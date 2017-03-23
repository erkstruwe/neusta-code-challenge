const config = require('./config')
const logger = require('./logger')
const server = require('./server')

server().listen(
    config.port,
    () => {
        logger.info('web worker listening on port ' + config.port)
    }
)
