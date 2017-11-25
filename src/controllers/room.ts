import * as lodash from 'lodash'

import {CustomError} from '../classes/CustomError'

export const roomController = {
    find: (req, res) => {
        // data preparation
        const result = lodash.chain(req.app.locals)
            .get('persons', [])
            .groupBy('room')
            .map((persons, room) => ({
                room,
                people: persons,
            }))
            .value()

        // response
        return res.send(result)
    },

    findOne: (req, res, next) => {
        // error handling: invalid room number requested
        if (req.params.id.length !== 4) {
            return next(new CustomError(400, 6, 'Room number does not have 4 digits'))
        }

        // data preparation
        const persons = lodash.chain(req.app.locals)
            .get('persons', [])
            .filter({room: req.params.id})
            .value()

        // error handling: no room found
        if (!persons.length) {
            return next(new CustomError(404, 5, 'Room "' + req.params.id + '" not found'))
        }

        // response
        return res.send({
            room: req.params.id,
            people: persons,
        })
    },
}
