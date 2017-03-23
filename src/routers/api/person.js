const express = require('express')

const config = require('../../config')
const controller = require('../../controllers/person')
const methodNotAllowedResponse = require('../../responses/methodNotAllowed')

// router
const router = express.Router(config.routing)

router.route('/').post(controller.parseCsv).all(methodNotAllowedResponse)

module.exports = router
