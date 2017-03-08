const formDataMiddleware = require('express-form-data')
const lodash = require('lodash')
const highland = require('highland')
const csvParse = require('csv-parse')

const Person = require('../classes/Person')
const personData = require('../classes/Person.data')
const config = require('../config')
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

        // error handling
        const fileStreams = lodash.chain(req)
            .get('files', {})
            .values()
            .value()
        if (fileStreams.length !== 1) {
            return res.error(400, 100, 'The number of file uploads does not equal 1')
        }

        // reset "database" (no hint in challenge rules if this should happen here or only in success case)
        req.app.locals.persons = []

        let uniqueRooms = new Set()
        let uniquePersons = new Set()

        return highland(fileStreams[0])
            .through(csvParse())
            // error handling
            // aborts request as soon as an error occurs, even BEFORE the full request has been received (important for large files)
            // try with a 1 GB file with duplicate rooms on the first two lines... (use http://localhost:3000/api/room/testData?maxPersonsPerRoom=10000 to get a 1 GB file)
            // validate unique room
            .map((csvLineArray) => {
                const room = +csvLineArray[0]
                if (uniqueRooms.has(room)) {
                    throw {statusCode: 400, code: 2, message: 'Duplicate room ' + room}
                }
                uniqueRooms.add(room)
                return csvLineArray
            })
            .through(Person.parseCsvThroughStream())
            // validate person
            .map((person) => {
                const validationResult = person.validateSync()
                if (validationResult) {
                    throw {
                        statusCode: 400,
                        code: 4,
                        message: lodash.map(validationResult.errors, (error) => error.message).join(' ')
                    }
                }
                return person
            })
            // validate unique person
            .map((person) => {
                if (uniquePersons.has(person.ldap)) {
                    throw {statusCode: 400, code: 3, message: 'Duplicate person with ldap ' + person.ldap}
                }
                uniquePersons.add(person.ldap)
                return person
            })
            // error handling
            // all errors that have been thrown along the way show up here
            .stopOnError((e) => {
                logger.warn(e)
                return res.error(e.statusCode, e.code, e.message)
            })
            // write to database in batches to save network round trips
            .batch(config.batchSize)
            .each((personsBatch) => {
                // only write to database if no error occurred
                if (!res.headersSent) {
                    req.app.locals.persons.push(...personsBatch)
                }
            })
            .done(function() {
                logger.profile('POST /api/person')
                if (!res.headersSent) {
                    logger.info('successfully imported ' + req.app.locals.persons.length + ' persons')
                    return res.json(null)
                }
            })
    }],

    reset: (req, res) => {
        req.app.locals.persons = personData
        return res.json(null)
    },

    find: (req, res) => {
        return res.send(req.app.locals.persons.map((person) => person.forOutput()))
    },

    findOne: (req, res) => {
        const person = lodash.find(req.app.locals.persons, {ldap: req.params.ldap})
        if (person) {
            return res.send(person.forOutput())
        }
        return res.error(404, 101, 'No user found with ldap ' + req.params.ldap)
    }
}
