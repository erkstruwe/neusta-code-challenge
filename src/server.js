const express = require('express')
const compression = require('compression')
const helmet = require('helmet')

const config = require('./config')
const errorResponseMiddleware = require('./middlewares/errorResponse')
const router = require('./routers')

module.exports = () => {
    const app = express()
    app.set('case sensitive routing', config.routing.caseSensitive)
    app.set('strict routing', config.routing.strict)

    app.use(compression())
    app.use(helmet())

    app.use(errorResponseMiddleware)

    app.use(router)

    // initialize "database"
    app.locals.persons = []

    return app
}
