import * as express from 'express'

import {config} from '../../config'
import {roomController} from '../../controllers/room'
import {methodNotAllowedResponse} from '../../responses/methodNotAllowed'

// router
export const apiRoomRouter = express.Router(config.routing)
apiRoomRouter.route('/').get(roomController.find).all(methodNotAllowedResponse)
apiRoomRouter.route('/:id').get(roomController.findOne).all(methodNotAllowedResponse)
