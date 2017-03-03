const formDataMiddleware = require('express-form-data')
const highland = require('highland')
const csvParse = require('csv-parse')

const Person = require('../classes/Person')
const logger = require('../logger')

module.exports = {
    parseCsv: [formDataMiddleware.parse(), formDataMiddleware.stream(), (req, res) => {
        // leveraging node's stream API here
        // might look unfamiliar to developers not used to node development, but has huge advantages:
        // super fast, parallel computing
        // shared back-pressure: data is processed as fast as the slowest consumer, e. g. incoming HTTP data is throttled if inserting into database was slow to prevent buffers and memory size from growing
        // starts processing immediately (while the rest of the request is still being received)
        // very low memory usage, can handle input files of any size, even if they exceed the system's memory
        // TODO: error handling
        // TODO: timing
        logger.profile('data import at POST /api/person')

        let uniqueRooms = new Set()
        let uniquePersons = new Set()

        return highland(req.files.persons)
            .through(csvParse())
            // error handling
            // aborts request as soon as an error occurs, even BEFORE the full request has been received (important for large files)
            // try with a 1 GB file with duplicate rooms on the first two lines... (use wget http://localhost:3000/api/room/testData?maxPersonsPerRoom=10000 to get one)
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
                return res.error(e.statusCode, e.code, e.message)
            })
            .through(Person.parseCsvThroughStream())
            .stopOnError((e) => {
                logger.warn(e)
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
                return res.error(e.statusCode, e.code, e.message)
            })
            .toArray((persons) => {
                req.app.locals.persons = persons
                logger.profile('data import at POST /api/person')
                return res.send()
            })
    }]
}
