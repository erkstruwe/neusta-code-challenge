const formDataMiddleware = require('express-form-data')
const lodash = require('lodash')
const highland = require('highland')
const csvParse = require('csv-parse')

const csvParser = require('../services/csvParser')
const logger = require('../services/logger')

module.exports = {
    parseCsv: [formDataMiddleware.parse(), formDataMiddleware.stream(), (req, res) => {
        logger.profile('POST /api/person/')

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
            .map((csvLineArray) => {
                const room = csvLineArray[0]
                if (uniqueRooms.has(room)) {
                    throw {statusCode: 400, code: 2, message: 'Duplicate room ' + room}
                }
                uniqueRooms.add(room)
                return csvLineArray
            })
            // parse to stream of persons
            .through(csvParser.personThroughStream())
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
            .toArray((personArray) => {
                logger.profile('POST /api/person/')

                // only write to database if no error occurred
                if (!res.headersSent) {
                    req.app.locals.persons.push(...personArray)
                    logger.info('successfully imported ' + req.app.locals.persons.length + ' persons')
                    return res.json(null)
                }
            })
    }]
}
