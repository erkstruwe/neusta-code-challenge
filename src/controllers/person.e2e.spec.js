const fs = require('fs')
const request = require('request')

const config = require('../config')

describe('person controller', function() {

    describe('post /', function() {
        it('should return a statusCode of 200 and a null response as json for the original test data file', function(cb) {
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
        it('should return a statusCode of 200 and a null response as json for the test data file', function(cb) {
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
        it('should return a statusCode of 400 and error 2 as json for duplicate rooms', function(cb) {
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
        it('should return a statusCode of 400 and error 4 as json for invalid rooms', function(cb) {
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
        it('should return a statusCode of 400 and error 3 as json for duplicate persons', function(cb) {
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
        it('should return a statusCode of 400 and error 4 as json for invalid persons', function(cb) {
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
        it('should return a statusCode of 400 and error 100 for more than one file upload', function(cb) {
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
        it('should return a statusCode of 400 and error 100 for no file upload', function(cb) {
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
        it('should return status code 200 and a null response as json', function(cb) {
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

        it('should return a statusCode of 200 and an array of persons as json', function(cb) {
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
                    expect(body[1]).toEqual({
                        'first name': 'Blade',
                        'last name': 'Daywalker',
                        'title': '',
                        'name addition': '',
                        'ldapuser': 'bdaywalker'
                    })
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

        it('should return a person as json', function(cb) {
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
        it('should return a statusCode of 404 and error 101 if the person does not exist', function(cb) {
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
