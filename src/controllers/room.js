const lodash = require('lodash')
const highland = require('highland')
const csvStringify = require('csv-stringify')

module.exports = {
    find: (req, res) => {
        // this would usually come as a stream from mongodb, but prohibited by challenge rules
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
        // this would usually come as a stream from mongodb, but prohibited by challenge rules
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
    },

    // function to create test data in csv format for arbitrary sizes
    // again, there's no upper size limit here, no matter how small the system's memory is
    // maxPersonsPerRoom = 10 => ~1MB, maxPersonsPerRoom = 10000 => ~1GB, and so on
    testData: (req, res) => {
        const maxPersonsPerRoom = req.query.maxPersonsPerRoom || 10
        let personIndex = 0

        return highland(lodash.range(1000, 10000))
            .map((roomNumber) => {
                const personCount = lodash.random(0, maxPersonsPerRoom)
                let csvLineArray = [roomNumber]
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
            .pipe(res)
    }
}
