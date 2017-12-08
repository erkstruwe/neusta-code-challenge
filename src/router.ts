import * as express from 'express'

import {config} from './config'
import {personController} from './controllers/person'
import {roomController} from './controllers/room'
import {methodNotAllowedResponse} from './responses/methodNotAllowed'

export const router = express.Router(config.routing)
router.get('/', (req, res) => res.send(config.package.name + ' ' + config.package.version))
router.route('/api/import').post(personController.create).all(methodNotAllowedResponse)
router.route('/api/room/').get(roomController.find).all(methodNotAllowedResponse)
router.route('/api/room/:id').get(roomController.findOne).all(methodNotAllowedResponse)
