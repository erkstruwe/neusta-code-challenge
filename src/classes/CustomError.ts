export class CustomError extends Error {
    httpStatusCode: number
    code: number

    constructor(httpStatusCode, code, message) {
        super()
        this.httpStatusCode = httpStatusCode
        this.code = code
        this.message = message
    }
}
