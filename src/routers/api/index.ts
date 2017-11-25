import * as express from 'express'

import {config} from '../../config'
import {personController} from '../../controllers/person'
import {methodNotAllowedResponse} from '../../responses/methodNotAllowed'
import {apiRoomRouter} from './room'

// router
export const apiRouter = express.Router(config.routing)
apiRouter.use('/room/', apiRoomRouter)
// inconsistent endpoint name in challenge, thus redirect to POST /api/person/ along with form data
apiRouter.route('/import').post(personController.create).all(methodNotAllowedResponse)
