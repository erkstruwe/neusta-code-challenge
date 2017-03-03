const formDataMiddleware = require('express-form-data')
const highland = require('highland')
const csvParse = require('csv-parse')

const Person = require('../classes/Person')
const personData = require('../classes/Person.data')
const logger = require('../logger')

module.exports = {
    parseCsv: [formDataMiddleware.parse(), formDataMiddleware.stream(), (req, res) => {
        // leveraging node's stream API here
        // might look unfamiliar to developers not used to node development, but has huge advantages:
        // super fast, parallel computing
        // shared back-pressure: data is processed as fast as the slowest consumer, e. g. incoming HTTP data is throttled if inserting into database was slow to prevent buffers and memory size from growing
        // starts processing immediately (while the rest of the request is still being received)
        // very low memory usage, can handle input files of any size, even if they exceed the system's memory
        logger.profile('POST /api/person')

        // reset "database"
        req.app.locals.persons = []

        let uniqueRooms = new Set()
        let uniquePersons = new Set()

        return highland(req.files.persons)
            .through(csvParse())
            // error handling
            // aborts request as soon as an error occurs, even BEFORE the full request has been received (important for large files)
            // try with a 1 GB file with duplicate rooms on the first two lines... (use http://localhost:3000/api/room/testData?maxPersonsPerRoom=10000 to get a 1 GB file)
            .map((csvLineArray) => {
                const room = +csvLineArray[0]
                if (uniqueRooms.has(room)) {
                    throw {statusCode: 400, code: 2, message: 'Duplicate room ' + room}
                }
                uniqueRooms.add(room)
                return csvLineArray
            })
            .stopOnError((e) => {
                logger.warn(e)
                logger.profile('POST /api/person')
                return res.error(e.statusCode, e.code, e.message)
            })
            .through(Person.parseCsvThroughStream())
            .stopOnError((e) => {
                logger.warn(e)
                logger.profile('POST /api/person')
                return res.error(400, 100)
            })
            // error handling
            .map((person) => {
                if (uniquePersons.has(person.ldap)) {
                    throw {statusCode: 400, code: 3, message: 'Duplicate person with ldap ' + person.ldap}
                }
                uniquePersons.add(person.ldap)
                return person
            })
            .stopOnError((e) => {
                logger.warn(e)
                logger.profile('POST /api/person')
                return res.error(e.statusCode, e.code, e.message)
            })
            // write to "database" in batches of 10,000 persons to save round trips
            .batch(10000)
            .each((personsBatch) => {
                req.app.locals.persons.push(...personsBatch)
            })
            .done(function() {
                logger.profile('POST /api/person')
                logger.info('successfully imported ' + req.app.locals.persons.length + ' persons')
                return res.send()
            })
    }],

    reset: (req, res) => {
        req.app.locals.persons = personData
        return res.send()
    }
}
