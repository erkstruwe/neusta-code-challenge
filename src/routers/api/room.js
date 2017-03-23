const express = require('express')

const config = require('../../config')
const controller = require('../../controllers/room')
const methodNotAllowedResponse = require('../../responses/methodNotAllowed')

// router
const router = express.Router(config.routing)

router.route('/').get(controller.find).all(methodNotAllowedResponse)
router.route('/:id').get(controller.findOne).all(methodNotAllowedResponse)

module.exports = router
