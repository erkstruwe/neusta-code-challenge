const middleware = require('./errorResponse')

describe('errorResponse middleware', function() {
    beforeEach(function() {
        this.req = {}
        this.res = jasmine.getExpressResponse()
        delete this.res.error
        this.next = jasmine.createSpy('next')
    })

    it('should set the statusCode and return an error object', function() {
        middleware(this.req, this.res, this.next)
        this.res.error(400, 1, 'custom message')
        expect(this.res.status).toHaveBeenCalledWith(400)
        const r = this.res.send.calls.mostRecent().args[0]
        expect(r).toEqual({code: 1, message: 'custom message'})
    })
    it('should send a default message if none is given', function() {
        middleware(this.req, this.res, this.next)
        this.res.error(400, 1)
        expect(this.res.status).toHaveBeenCalledWith(400)
        const r = this.res.send.calls.mostRecent().args[0]
        expect(r).toEqual({code: 1, message: 'error code 1'})
    })
    it('should handle unexpected errors', function() {
        middleware(this.req, this.res, this.next)
        this.res.error(undefined, undefined, undefined)
        expect(this.res.status).toHaveBeenCalledWith(400)
        const r = this.res.send.calls.mostRecent().args[0]
        expect(r).toEqual({code: 101, message: 'error code 101'})
    })
    it('should handle errors without statusCode and code', function() {
        middleware(this.req, this.res, this.next)
        this.res.error(undefined, undefined, 'Custom error message')
        expect(this.res.status).toHaveBeenCalledWith(400)
        const r = this.res.send.calls.mostRecent().args[0]
        expect(r).toEqual({code: 101, message: 'Custom error message'})
    })
})
