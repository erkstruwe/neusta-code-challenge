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
        // Leveraging node's stream API here
        // While looking unfamiliar to developers not used to node development, it has huge advantages compared to other approaches:
        //   Super fast, parallel computing
        //   Shared back-pressure
        //     Data is processed as fast as the slowest consumer in the stream's pipeline.
        //     During a file upload, incoming HTTP data is throttled if a downstream task (e. g. inserting into database) is slow to prevent buffers and memory size from growing.
        //   As an example, data processing of HTTP requests is started as soon as the first chunks of data arrive at the server (while the rest of the request is still being received).
        //   After having been processed, chunks of data do not stay in memory. At no time is a large request body fully held in memory.
        //   With its very low memory usage, it can handle input files of any size, even if they exceed the system's memory.
        logger.profile('POST /api/person')

        // use upload file stream
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
            // parse csv lines to stream of arrays
            .through(csvParse())
            // error handling: validate unique room
            // If there is a duplicate room on the first two lines of a 10 GB file, the server responds with an error message immediately, not only after several minutes of uploading and analyzing the file.
            // Try with a 1 GB file with duplicate rooms on the first two lines... (use http://localhost:3000/api/room/testData?maxPersonsPerRoom=10000 to get a 1 GB file)
            .map((csvLineArray) => {
                const room = csvLineArray[0]
                if (uniqueRooms.has(room)) {
                    throw {statusCode: 400, code: 2, message: 'Duplicate room ' + room}
                }
                uniqueRooms.add(room)
                return csvLineArray
            })
            // parse to stream of persons
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
            // error handling: validate unique person
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
            // write to database in batches (e. g. 10,000) to save network round trips
            .batch(config.batchSize)
            .each((personsBatch) => {
                // only write to database if no error occurred
                if (!res.headersSent) {
                    // since each person is already a mongoose model, saving to a real mongodb is as easy as
                    // Person.collection.insert(personsBatch, ...)
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
