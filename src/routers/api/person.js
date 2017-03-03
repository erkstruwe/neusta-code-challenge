const express = require('express')

const controller = require('../../controllers/person')
const methodNotAllowedResponse = require('../../responses/methodNotAllowed')

// router
const router = express.Router()

router.route('/').post(controller.parseCsv).all(methodNotAllowedResponse)

module.exports = router
