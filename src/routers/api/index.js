const express = require('express')

const config = require('../../config')
const roomRouter = require('./room')
const personRouter = require('./person')
const methodNotAllowedResponse = require('../../responses/methodNotAllowed')

// router
const router = express.Router(config.routing)

router.use('/room/', roomRouter)
router.use('/person/', personRouter)

// inconsistent endpoint name in challenge, thus redirect to POST /api/person/ along with form data
router.route('/import').post((req, res) => res.redirect(307, '/api/person/')).all(methodNotAllowedResponse)

module.exports = router
