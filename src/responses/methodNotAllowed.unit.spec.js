const response = require('./methodNotAllowed')

describe('methodNotAllowed response', function() {
    beforeEach(function() {
        this.req = {}
        this.res = jasmine.getExpressResponse()
    })

    it('should set the statusCode to 405 and return an empty response', function() {
        response(this.req, this.res)
        expect(this.res.status).toHaveBeenCalledWith(405)
        const r = this.res.json.calls.mostRecent().args[0]
        expect(r).toBe(null)
    })
})
