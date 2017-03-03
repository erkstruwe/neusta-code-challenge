const express = require('express')

const controller = require('../../controllers/person')
const methodNotAllowedResponse = require('../../responses/methodNotAllowed')

// router
const router = express.Router()

router.route('/').post(controller.parseCsv).delete(controller.reset).all(methodNotAllowedResponse) // delete method is here for testing purposes, should not be there in production

module.exports = router
