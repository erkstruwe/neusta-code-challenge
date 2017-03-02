const express = require('express')
const compression = require('compression')
const helmet = require('helmet')

const personData = require('./classes/Person/Person.data')

const router = require('./routers')
const config = require('./config')
const logger = require('./logger')

const app = express()

app.use(compression())
app.use(helmet())

// error handler
app.use((req, res, next) => {
    res.error = (statusCode, errorCode, message) => res.status(statusCode).send({
        code: errorCode,
        message: message ? message : 'Fehlercode ' + errorCode
    })
    return next()
})

app.use(router)

// test data
app.locals.persons = personData

app.listen(config.port, () => {
    logger.info('listening on port ' + config.port)
})
