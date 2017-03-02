const express = require('express')

const packageJson = require('../../package.json')
const apiRouter = require('./api')

const router = express.Router({
    caseSensitive: true,
    strict: true
})

router.get('/', (req, res) => res.send(packageJson.name + ' ' + packageJson.version))

router.use('/api', apiRouter)

module.exports = router
