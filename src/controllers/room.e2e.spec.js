const fs = require('fs')
const request = require('request')

const config = require('../config')

describe('room controller', function() {
    beforeAll(function(cb) {
        // reset "database" to test data
        return request(
            {
                method: 'POST',
                url: config.baseUrl + '/api/person/',
                json: true,
                formData: {
                    persons: fs.createReadStream('data/test.csv')
                }
            },
            cb
        )
    })

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
                    expect(r.headers['content-type']).toBe('application/json; charset=utf-8')
                    expect(body.length).toBe(2)
                    expect(body[0].room).toBe('1000')
                    expect(body[0].people.length).toBe(2)
                    expect(body[0].people[0]).toEqual({
                        'first name': 'Bruce',
                        'last name': 'Wayne',
                        'title': 'Dr.',
                        'name addition': 'von',
                        'ldapuser': 'bvwayne'
                    })
                    expect(body[1].room).toBe('1001')
                    expect(body[1].people.length).toBe(1)
                    expect(body[1].people[0]).toEqual({
                        'first name': 'Mickey',
                        'last name': 'Mouse',
                        'title': '',
                        'name addition': '',
                        'ldapuser': 'mmouse'
                    })
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
                    expect(r.headers['content-type']).toBe('application/json; charset=utf-8')
                    expect(body).toBe(null)
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
                    expect(r.headers['content-type']).toBe('application/json; charset=utf-8')
                    expect(body.room).toBe('1000')
                    expect(body.people.length).toBe(2)
                    expect(body.people[0]).toEqual({
                        'first name': 'Bruce',
                        'last name': 'Wayne',
                        'title': 'Dr.',
                        'name addition': 'von',
                        'ldapuser': 'bvwayne'
                    })
                    return cb()
                }
            )
        })
        it('should return a statusCode of 400 and error 6 as json if room id is not 4 digits', function(cb) {
            return request(
                {
                    method: 'GET',
                    url: config.baseUrl + '/api/room/100',
                    json: true
                },
                (e, r, body) => {
                    expect(r.statusCode).toBe(400)
                    expect(r.headers['content-type']).toBe('application/json; charset=utf-8')
                    expect(body).toEqual({code: 6, message: jasmine.any(String)})
                    return cb()
                }
            )
        })
        it('should return a statusCode of 404 and error 5 if room is not found', function(cb) {
            return request(
                {
                    method: 'GET',
                    url: config.baseUrl + '/api/room/9999',
                    json: true
                },
                (e, r, body) => {
                    expect(r.statusCode).toBe(404)
                    expect(r.headers['content-type']).toBe('application/json; charset=utf-8')
                    expect(body).toEqual({code: 5, message: jasmine.any(String)})
                    return cb()
                }
            )
        })
    })

})
