import * as fs from 'fs'

import * as request from 'request'

import {config} from '../src/config'

describe('/api/import routes', function() {
    describe('post', function() {
        it('should return a statusCode of 200 and a null response as json for the original test data file', function(cb) {
            return request(
                {
                    method: 'POST',
                    url: config.baseUrl + '/api/import',
                    json: true,
                    formData: {
                        persons: fs.createReadStream('e2e/data/personsOriginal.csv')
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
        it('should return a statusCode of 200 and a null response as json for the difficult test data file', function(cb) {
            return request(
                {
                    method: 'POST',
                    url: config.baseUrl + '/api/import',
                    json: true,
                    formData: {
                        persons: fs.createReadStream('e2e/data/persons.csv')
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
                    url: config.baseUrl + '/api/import',
                    json: true,
                    formData: {
                        persons: fs.createReadStream('e2e/data/duplicateRoom.csv')
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
                    url: config.baseUrl + '/api/import',
                    json: true,
                    formData: {
                        persons: fs.createReadStream('e2e/data/invalidRoom.csv')
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
                    url: config.baseUrl + '/api/import',
                    json: true,
                    formData: {
                        persons: fs.createReadStream('e2e/data/duplicatePerson.csv')
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
                    url: config.baseUrl + '/api/import',
                    json: true,
                    formData: {
                        persons: fs.createReadStream('e2e/data/invalidPerson.csv')
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
                    url: config.baseUrl + '/api/import',
                    json: true,
                    formData: {
                        persons: fs.createReadStream('e2e/data/persons.csv'),
                        persons2: fs.createReadStream('e2e/data/persons.csv')
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
                    url: config.baseUrl + '/api/import',
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

})
