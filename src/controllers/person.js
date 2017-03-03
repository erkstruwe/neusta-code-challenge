const formDataMiddleware = require('express-form-data')

const Person = require('../classes/Person')
const logger = require('../logger')

module.exports = {
    parseCsv: [formDataMiddleware.parse(), formDataMiddleware.stream(), (req, res) => {
        // leveraging node's stream API here:
        // super fast, parallel computing
        // starts processing immediately (while the rest of the request is still being received)
        // very low memory usage, can handle input files of any size, even if they exceed the system's memory (only applies if a real database is used, which is prohibited by the challenge rules)
        // TODO: error handling
        logger.profile('data import at POST /api/person')
        return req.files.persons
            .pipe(Person.parseCsvThroughStream())
            .errors(logger.warn)
            .toArray((persons) => {
                req.app.locals.persons = persons
                logger.profile('data import at POST /api/person')
                return res.send()
            })
    }]
}
