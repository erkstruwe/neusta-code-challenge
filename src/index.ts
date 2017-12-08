import * as compression from 'compression'
import * as express from 'express'
import * as helmet from 'helmet'

import {config} from './config'
import {errorMiddleware} from './middlewares/error'
import {router} from './router'
import {logger} from './services/logger'

const app = express()
app.set('case sensitive routing', config.routing.caseSensitive)
app.set('strict routing', config.routing.strict)

app.use(compression())
app.use(helmet())

app.use(router)

app.use(errorMiddleware)

// initialize "database"
app.locals.persons = []

app.listen(config.port, () => logger.info('listening on port ' + config.port))
