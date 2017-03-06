const fs = require('fs')

const request = require('request')

const config = require('../config')

describe('person controller', function() {

    describe('post /', function() {
        it('should return a statusCode of 200 and an empty response for the original test data file', function(cb) {
            return request(
                {
                    method: 'POST',
                    url: config.baseUrl + '/api/person/',
                    json: true,
                    formData: {
                        persons: fs.createReadStream('data/personsOriginal.csv')
                    }
                },
                (e, r, body) => {
                    expect(r.statusCode).toBe(200)
                    expect(r.headers['content-type']).toBe('application/json; charset=utf-8')
                    expect(body).toBe(null)
                    return cb()
                }
            )
        })
        it('should return a statusCode of 200 and an empty response for the test data file', function(cb) {
            return request(
                {
                    method: 'POST',
                    url: config.baseUrl + '/api/person/',
                    json: true,
                    formData: {
                        persons: fs.createReadStream('data/persons.csv')
                    }
                },
                (e, r, body) => {
                    expect(r.statusCode).toBe(200)
                    expect(r.headers['content-type']).toBe('application/json; charset=utf-8')
                    expect(body).toBe(null)
                    return cb()
                }
            )
        })
        it('should return an error for duplicate rooms', function(cb) {
            return request(
                {
                    method: 'POST',
                    url: config.baseUrl + '/api/person/',
                    json: true,
                    formData: {
                        persons: fs.createReadStream('data/duplicateRoom.csv')
                    }
                },
                (e, r, body) => {
                    expect(r.statusCode).toBe(400)
                    expect(r.headers['content-type']).toBe('application/json; charset=utf-8')
                    expect(body).toEqual({code: 2, message: jasmine.any(String)})
                    return cb()
                }
            )
        })
        it('should return an error for duplicate persons', function(cb) {
            return request(
                {
                    method: 'POST',
                    url: config.baseUrl + '/api/person/',
                    json: true,
                    formData: {
                        persons: fs.createReadStream('data/duplicatePerson.csv')
                    }
                },
                (e, r, body) => {
                    expect(r.statusCode).toBe(400)
                    expect(r.headers['content-type']).toBe('application/json; charset=utf-8')
                    expect(body).toEqual({code: 3, message: jasmine.any(String)})
                    return cb()
                }
            )
        })
        it('should return an error for invalid persons', function(cb) {
            return request(
                {
                    method: 'POST',
                    url: config.baseUrl + '/api/person/',
                    json: true,
                    formData: {
                        persons: fs.createReadStream('data/invalidPerson.csv')
                    }
                },
                (e, r, body) => {
                    expect(r.statusCode).toBe(400)
                    expect(r.headers['content-type']).toBe('application/json; charset=utf-8')
                    expect(body).toEqual({code: 4, message: jasmine.any(String)})
                    return cb()
                }
            )
        })
        it('should return an error for invalid room', function(cb) {
            return request(
                {
                    method: 'POST',
                    url: config.baseUrl + '/api/person/',
                    json: true,
                    formData: {
                        persons: fs.createReadStream('data/invalidRoom.csv')
                    }
                },
                (e, r, body) => {
                    expect(r.statusCode).toBe(400)
                    expect(r.headers['content-type']).toBe('application/json; charset=utf-8')
                    expect(body).toEqual({code: 4, message: jasmine.any(String)})
                    return cb()
                }
            )
        })
        it('should return an error for more than one file upload', function(cb) {
            return request(
                {
                    method: 'POST',
                    url: config.baseUrl + '/api/person/',
                    json: true,
                    formData: {
                        persons: fs.createReadStream('data/persons.csv'),
                        persons2: fs.createReadStream('data/persons.csv')
                    }
                },
                (e, r, body) => {
                    expect(r.statusCode).toBe(400)
                    expect(r.headers['content-type']).toBe('application/json; charset=utf-8')
                    expect(body).toEqual({code: 100, message: jasmine.any(String)})
                    return cb()
                }
            )
        })
        it('should return an error for no file upload', function(cb) {
            return request(
                {
                    method: 'POST',
                    url: config.baseUrl + '/api/person/',
                    json: true
                },
                (e, r, body) => {
                    expect(r.statusCode).toBe(400)
                    expect(r.headers['content-type']).toBe('application/json; charset=utf-8')
                    expect(body).toEqual({code: 100, message: jasmine.any(String)})
                    return cb()
                }
            )
        })
    })

    describe('delete /', function() {
        it('should return status code 200', function(cb) {
            return request(
                {
                    method: 'DELETE',
                    url: config.baseUrl + '/api/person/',
                    json: true
                },
                (e, r, body) => {
                    expect(r.statusCode).toBe(200)
                    expect(r.headers['content-type']).toBe('application/json; charset=utf-8')
                    expect(body).toBe(null)
                    return cb()
                }
            )
        })
    })

    describe('get /', function() {
        beforeAll(function(cb) {
            // reset "database" to test data
            return request(
                {
                    method: 'DELETE',
                    url: config.baseUrl + '/api/person/',
                    json: true
                },
                cb
            )
        })

        it('should return an array of persons', function(cb) {
            return request(
                {
                    method: 'GET',
                    url: config.baseUrl + '/api/person/',
                    json: true
                },
                (e, r, body) => {
                    expect(r.statusCode).toBe(200)
                    expect(r.headers['content-type']).toBe('application/json; charset=utf-8')
                    expect(body.length).toBe(3)
                    expect(body[0].ldapuser).toBe('bvwayne')
                    return cb()
                }
            )
        })
    })

    describe('get /:id', function() {
        beforeAll(function(cb) {
            // reset "database" to test data
            return request(
                {
                    method: 'DELETE',
                    url: config.baseUrl + '/api/person/',
                    json: true
                },
                cb
            )
        })

        it('should return a person', function(cb) {
            return request(
                {
                    method: 'GET',
                    url: config.baseUrl + '/api/person/bvwayne',
                    json: true
                },
                (e, r, body) => {
                    expect(r.statusCode).toBe(200)
                    expect(r.headers['content-type']).toBe('application/json; charset=utf-8')
                    expect(body.ldapuser).toBe('bvwayne')
                    return cb()
                }
            )
        })
        it('should return a 404 if person does not exist', function(cb) {
            return request(
                {
                    method: 'GET',
                    url: config.baseUrl + '/api/person/ckent',
                    json: true
                },
                (e, r, body) => {
                    expect(r.statusCode).toBe(404)
                    expect(r.headers['content-type']).toBe('application/json; charset=utf-8')
                    expect(body).toEqual({code: 101, message: jasmine.any(String)})
                    return cb()
                }
            )
        })
    })

})
