import * as csvParse from 'csv-parse'
import * as formDataMiddleware from 'express-form-data'
import * as highland from 'highland'
import * as lodash from 'lodash'

import {CustomError} from '../classes/CustomError'
import {personThroughStream} from '../services/csvParser'
import {logger} from '../services/logger'

export const personController = {
    create: [
        formDataMiddleware.parse(),
        formDataMiddleware.stream(),
        (req, res, next) => {
            const fileStreams = lodash.chain(req)
                .get('files', {})
                .values()
                .value()
            if (fileStreams.length !== 1) {
                return next(new CustomError(400, 100, 'The number of file uploads does not equal 1'))
            }

            const uniqueRooms = new Set()
            const uniquePersons = new Set()
            let errorCount = 0

            return highland(fileStreams[0])
            // parse csv lines to stream of arrays
                .through(csvParse({
                    relax_column_count: true,
                }))
                // error handling: validate unique room
                .map((csvLineArray) => {
                    const room = csvLineArray[0]
                    if (uniqueRooms.has(room)) {
                        throw new CustomError(400, 2, 'Duplicate room ' + room)
                    }
                    uniqueRooms.add(room)
                    return csvLineArray
                })
                // parse to stream of persons
                .through(personThroughStream())
                // validate person
                .map((person) => {
                    const validationError: null|{errors: Array<{message: string}>} = person.validateSync()
                    if (validationError) {
                        throw new CustomError(
                            400,
                            4,
                            lodash.map(validationError.errors, (error) => error.message).join(' '),
                        )
                    }
                    return person
                })
                // error handling: validate unique person
                .map((person) => {
                    if (uniquePersons.has(person.ldap)) {
                        throw new CustomError(400, 3, 'Duplicate person with ldap ' + person.ldap)
                    }
                    uniquePersons.add(person.ldap)
                    return person
                })
                // errors thrown along the pipeline show up here and get forwarded to the global error handler
                .stopOnError((e) => {
                    errorCount++
                    return next(e)
                })
                .toArray((personArray) => {
                    // only write to database and respond if no error occurred
                    if (!errorCount) {
                        req.app.locals.persons = personArray
                        return res.json(null)
                    }
                })
        },
    ],
}
