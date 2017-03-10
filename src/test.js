const config = require('./config')
const logger = require('./logger')
const server = require('./server')

server().listen(
    config.port,
    () => {
        logger.info('web worker for e2e testing listening on port ' + config.port)
    }
)
