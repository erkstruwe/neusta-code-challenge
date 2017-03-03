const formDataMiddleware = require('express-form-data')
const Person = require('../classes/Person')

module.exports = {
    parseCsv: [formDataMiddleware.parse(), formDataMiddleware.stream(), (req, res) => {
        // using node's stream API here:
        // super fast, parallel computing
        // starts processing while the rest of the request is still being received
        // very low memory usage, can handle input files of any size, even if they exceed the system's memory
        return req.files.persons
            .pipe(Person.parseCsvThroughStream())
            .toArray((array) => {
                return res.send(array)
            })
    }]
}
