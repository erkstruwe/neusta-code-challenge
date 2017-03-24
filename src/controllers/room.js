const lodash = require('lodash')

const logger = require('../services/logger')

module.exports = {
    find: (req, res) => {
        logger.profile('GET /api/room/')

        // data preparation
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
    }
}
