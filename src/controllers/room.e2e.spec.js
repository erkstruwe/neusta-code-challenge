const request = require('request')

const config = require('../config')

describe('room controller', function() {

    describe('get /', function() {
        it('should return an array of rooms with grouped and mapped persons in them', function(cb) {
            return request(
                {
                    method: 'GET',
                    url: config.baseUrl + '/api/room/',
                    json: true
                },
                (e, r, body) => {
                    expect(r.statusCode).toBe(200)
                    expect(body.length).toBe(2)
                    expect(body[0].room).toBe('1000') // sic! string
                    expect(body[0].people.length).toBe(2)
                    expect(body[0].people[0]['first name']).toBe('Bruce')
                    expect(body[1].room).toBe('1001') // sic! string
                    expect(body[1].people.length).toBe(1)
                    return cb()
                }
            )
        })
    })

    describe('put /', function() {
        it('should return status 405 (methodNotAllowed) and an empty response', function(cb) {
            return request(
                {
                    method: 'PUT',
                    url: config.baseUrl + '/api/room/',
                    json: true
                },
                (e, r, body) => {
                    expect(r.statusCode).toBe(405)
                    expect(body).toBeUndefined()
                    return cb()
                }
            )
        })
    })

    describe('get /:id', function() {
        it('should return a room object with grouped and mapped persons in it', function(cb) {
            return request(
                {
                    method: 'GET',
                    url: config.baseUrl + '/api/room/1000',
                    json: true
                },
                (e, r, body) => {
                    expect(r.statusCode).toBe(200)
                    expect(body.room).toBe('1000') //sic! string
                    expect(body.people.length).toBe(2)
                    expect(body.people[0]['first name']).toBe('Bruce')
                    return cb()
                }
            )
        })
        it('should return an error if room id is not 4 digits', function(cb) {
            return request(
                {
                    method: 'GET',
                    url: config.baseUrl + '/api/room/100',
                    json: true
                },
                (e, r, body) => {
                    expect(r.statusCode).toBe(400)
                    expect(body).toEqual({code: 6, message: jasmine.any(String)})
                    return cb()
                }
            )
        })
        it('should return an error if room is not found', function(cb) {
            return request(
                {
                    method: 'GET',
                    url: config.baseUrl + '/api/room/9999',
                    json: true
                },
                (e, r, body) => {
                    expect(r.statusCode).toBe(404)
                    expect(body).toEqual({code: 5, message: jasmine.any(String)})
                    return cb()
                }
            )
        })
    })

})
