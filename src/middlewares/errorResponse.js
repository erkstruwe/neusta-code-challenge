module.exports = (req, res, next) => {
    res.error = (statusCode, errorCode, message) => {
        statusCode = statusCode || 400
        errorCode = errorCode || 101
        message = message || ('error code ' + errorCode)
        return res
            .status(statusCode)
            .send({
                code: errorCode,
                message
            })
    }
    return next()
}
