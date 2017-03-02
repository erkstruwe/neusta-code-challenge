const express = require('express')
const compression = require('compression')
const helmet = require('helmet')

const Person = require('./classes/Person')

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
app.locals.persons = [
    new Person({
        firstName: 'Frank',
        lastName: 'Supper',
        title: 'Dr.',
        nameAddition: 'von',
        ldap: 'fsupper',
        room: 1111
    }),
    new Person({
        firstName: 'Dennis',
        lastName: 'Fischer',
        title: 'Dr.',
        nameAddition: 'von',
        ldap: 'dfischer',
        room: 1111
    }),
    new Person({
        firstName: 'Erk',
        lastName: 'Struwe',
        title: '',
        nameAddition: '',
        ldap: 'estruwe',
        room: 1112
    })
]

app.listen(config.port, () => {
    logger.info('listening on port ' + config.port)
})
