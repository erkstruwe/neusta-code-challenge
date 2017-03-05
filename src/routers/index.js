const express = require('express')

const config = require('../config')
const packageJson = require('../../package.json')
const apiRouter = require('./api')

const router = express.Router(config.routing)

router.get('/', (req, res) => res.send(packageJson.name + ' ' + packageJson.version))

router.use('/api/', apiRouter)

module.exports = router
