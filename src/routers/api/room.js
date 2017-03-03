const express = require('express')

const controller = require('../../controllers/room')
const methodNotAllowedResponse = require('../../responses/methodNotAllowed')

// router
const router = express.Router()

router.route('/').get(controller.find).all(methodNotAllowedResponse)
router.route('/testData').get(controller.testData).all(methodNotAllowedResponse)
router.route('/:id').get(controller.findOne).all(methodNotAllowedResponse)

module.exports = router
