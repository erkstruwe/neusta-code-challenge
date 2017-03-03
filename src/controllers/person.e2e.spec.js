const fs = require('fs')

const request = require('request')

const config = require('../config')

describe('person controller', function() {

    describe('post /', function() {
        it('should return a statusCode of 200 and an empty response', function(cb) {
            return request(
                {
                    method: 'POST',
                    url: config.baseUrl + '/api/person/',
                    formData: {
                        persons: fs.createReadStream('data/persons.csv')
                    }
                },
                (e, r, body) => {
                    expect(r.statusCode).toBe(200)
                    expect(body).toBe('')
                    return cb()
                }
            )
        })
    })

})
