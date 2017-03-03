const Person = require('./Person')

describe('Person class', function() {

    describe('constructor function', function() {
        it('should add whitelisted data to instance', function() {
            const person = new Person({firstName: 'Bruce'})
            expect(person.firstName).toBe('Bruce')
        })
        it('should not add non-whitelisted data to instance', function() {
            const person = new Person({firstName2: 'Bruce'})
            expect(person.firstName2).toBeUndefined()
        })
    })

    describe('toObject function', function() {
        it('should should map attributes to space-separated attributes', function() {
            const person = new Person({
                firstName: 'Bruce',
                lastName: 'Wayne',
                title: 'Phd',
                nameAddition: 'von',
                ldap: 'bwayne',
                room: 1
            })
            expect(person.toObject()).toEqual({
                'first name': 'Bruce',
                'last name': 'Wayne',
                'title': 'Phd',
                'name addition': 'von',
                'ldapuser': 'bwayne'
            })
        })
    })

    describe('parseCsvPersonString function', function() {

    })

})
