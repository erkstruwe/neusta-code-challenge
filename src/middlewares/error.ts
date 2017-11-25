import {CustomError} from '../classes/CustomError'

export function errorMiddleware(err, req, res, next) {
    if (res.headersSent || !(err instanceof CustomError)) {
        return next(err)
    }

    const customError: CustomError = err as CustomError
    return res.status(customError.httpStatusCode)
        .send({
            code: customError.code,
            message: customError.message || ('error code ' + customError.code),
        })
}
