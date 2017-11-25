import * as express from 'express'

import {config} from '../config'
import {apiRouter} from './api/index'

export const router = express.Router(config.routing)
router.get('/', (req, res) => res.send(config.package.name + ' ' + config.package.version))
router.use('/api/', apiRouter)
