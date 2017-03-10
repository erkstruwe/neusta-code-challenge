const express = require('express')

const config = require('../../config')
const controller = require('../../controllers/room')
const methodNotAllowedResponse = require('../../responses/methodNotAllowed')

// router
const router = express.Router(config.routing)

router.route('/').get(controller.find).all(methodNotAllowedResponse)
router.route('/testData').get(controller.testData).all(methodNotAllowedResponse) // this disables finding room number 'testData' (which is invalid anyway) and is here only for testing purposes
router.route('/:id').get(controller.findOne).all(methodNotAllowedResponse)

module.exports = router
