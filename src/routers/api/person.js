const express = require('express')

const config = require('../../config')
const controller = require('../../controllers/person')
const methodNotAllowedResponse = require('../../responses/methodNotAllowed')

// router
const router = express.Router(config.routing)

router.route('/').post(controller.parseCsv).get(controller.find).delete(controller.reset).all(methodNotAllowedResponse) // delete method is here for testing purposes, should not be there in production
router.route('/:ldap').get(controller.findOne).all(methodNotAllowedResponse)

module.exports = router
