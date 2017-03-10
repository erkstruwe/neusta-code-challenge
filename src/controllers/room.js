const lodash = require('lodash')
const highland = require('highland')
const csvStringify = require('csv-stringify')

const logger = require('../logger')

module.exports = {
    find: (req, res) => {
        // data preparation
        // this would usually come as a stream from mongodb, but prohibited by challenge rules
        logger.profile('GET /api/room/')
        const result = lodash.chain(req.app.locals)
            .get('persons', [])
            .groupBy('room')
            .map((persons, room) => ({
                room,
                people: persons.map((person) => person.forOutput())
            }))
            .value()

        // response
        logger.profile('GET /api/room/')
        return res.send(result)
    },

    findOne: (req, res) => {
        logger.profile('GET /api/room/:id')

        // error handling: invalid room number requested
        if (req.params.id.length !== 4) {
            logger.profile('GET /api/room/:id')
            return res.error(400, 6, 'Room number does not have 4 digits')
        }

        // data preparation
        // this would usually come as a stream from mongodb, but prohibited by challenge rules
        const persons = lodash.chain(req.app.locals)
            .get('persons', [])
            .filter({room: req.params.id})
            .value()

        // error handling: no room found
        if (!persons.length) {
            logger.profile('GET /api/room/:id')
            return res.error(404, 5, 'Room "' + req.params.id + '" not found')
        }

        // response
        logger.profile('GET /api/room/:id')
        return res.send({
            room: req.params.id,
            people: persons.map((person) => person.forOutput())
        })
    },

    // function to create test data in csv format for arbitrary sizes
    // again, there's no upper size limit here, no matter how small the system's memory is
    // use http://localhost:3000/api/room/testData?maxPersonsPerRoom=10 in your browser to download it
    // maxPersonsPerRoom=10 => ~1MB, maxPersonsPerRoom=10000 => ~1GB, and so on
    testData: (req, res) => {
        const maxPersonsPerRoom = req.query.maxPersonsPerRoom || 1000
        let personIndex = 0

        return highland(lodash.range(1000, 10000))
            .map((roomNumber) => {
                const personCount = lodash.random(0, maxPersonsPerRoom)
                let csvLineArray = [roomNumber.toString()]
                for (let i = 0; i  < maxPersonsPerRoom; i++) {
                    personIndex++
                    if (i < personCount) {
                        csvLineArray.push(personIndex + ' ' + personIndex + ' (' + personIndex + ')')
                    } else {
                        csvLineArray.push('')
                    }
                }
                return csvLineArray
            })
            .through(csvStringify())
            .pipe(res.type('csv').attachment('testData.csv'))
    }
}
