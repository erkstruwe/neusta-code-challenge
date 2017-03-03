const lodash = require('lodash')

module.exports = {
    find: (req, res) => {
        // should stream from a real database instead, but prohibited by challenge rules
        return res.send(lodash.chain(req.app.locals)
            .get('persons', [])
            .groupBy('room')
            .map((persons, room) => ({
                room,
                people: persons.map((person) => person.toObject())
            }))
            .value()
        )
    },

    findOne: (req, res) => {
        // error handling
        if (req.params.id.length !== 4) {
            return res.error(400, 6, 'Room number does not have 4 digits')
        }

        // data preparation
        // should stream from a real database instead, but prohibited by challenge rules
        const roomId = +req.params.id
        const persons = lodash.chain(req.app.locals)
            .get('persons', [])
            .filter({room: roomId})
            .value()

        // error handling
        if (!persons.length) {
            return res.error(404, 5, 'Room not found')
        }

        // response
        return res.send({
            room: req.params.id,
            people: persons.map((person) => person.toObject())
        })
    }
}
