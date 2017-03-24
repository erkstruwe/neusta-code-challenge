const logger = require('./logger')

describe('logger service', function() {
    it('should export something with log, info, warn, and error method', function() {
        expect(typeof logger.log).toBe('function')
    })
})
