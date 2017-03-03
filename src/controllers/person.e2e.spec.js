const fs = require('fs')

const request = require('request')

const config = require('../config')

describe('person controller', function() {

    fdescribe('post /', function() {
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
                    expect(body).toBeUndefined()
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
                    expect(body).toEqual({code: 3, message: jasmine.any(String)})
                    return cb()
                }
            )
        })
    })

})
