const express = require('express')

const roomRouter = require('./room')

// router
const router = express.Router({
    caseSensitive: true,
    strict: true
})

router.use('/room', roomRouter)

module.exports = router
