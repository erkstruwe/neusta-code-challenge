module.exports = (req, res, next) => {
    res.error = (statusCode, errorCode, message) => res.status(statusCode).send({
        code: errorCode,
        message: message ? message : 'error code ' + errorCode
    })
    return next()
}
