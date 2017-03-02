const lodash = require('lodash')

const controller = require('./room')
const personData = require('../classes/Person.data')

describe('room controller', function() {
    beforeEach(function() {
        this.req = {}
        lodash.set(this, 'req.app.locals.persons', personData)
        this.res = jasmine.getExpressResponse()
    })

    describe('find function', function() {
        it('should return an array of rooms with grouped and mapped persons in them', function() {
            controller.find(this.req, this.res)
            const r = this.res.send.calls.mostRecent().args[0]
            expect(r.length).toBe(2)
            expect(r[0].room).toBe('1000') // sic! string
            expect(r[0].people.length).toBe(2)
            expect(r[0].people[0]['first name']).toBe('Bruce')
            expect(r[1].room).toBe('1001') // sic! string
            expect(r[1].people.length).toBe(1)
        })
    })

    describe('findOne function', function() {
        it('should return a room object with grouped and mapped persons in it', function() {
            lodash.set(this, 'req.params.id', '1000') // sic! string
            controller.findOne(this.req, this.res)
            const r = this.res.send.calls.mostRecent().args[0]
            expect(r.room).toBe('1000') //sic! string
            expect(r.people.length).toBe(2)
            expect(r.people[0]['first name']).toBe('Bruce')
        })
        it('should return an error if room id is not 4 digits', function() {
            lodash.set(this, 'req.params.id', '100') // sic! string
            controller.findOne(this.req, this.res)
            expect(this.res.error).toHaveBeenCalledWith(400, 6, jasmine.any(String))
            expect(this.res.send).not.toHaveBeenCalled()
        })
        it('should return an error if room is not found', function() {
            lodash.set(this, 'req.params.id', '9999') // sic! string
            controller.findOne(this.req, this.res)
            expect(this.res.error).toHaveBeenCalledWith(404, 5, jasmine.any(String))
            expect(this.res.send).not.toHaveBeenCalled()
        })
    })

})
