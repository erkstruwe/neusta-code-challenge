const fs = require('fs')

const highland = require('highland')

const Person = require('./Person')
const personData = require('./Person.data')

describe('Person class', function() {

    describe('constructor function', function() {
        it('should add parameters to this', function() {
            const person = new Person('Dr.', 'Bruce', 'von', 'Wayne', 'bvwayne', 1000)
            expect(person.title).toBe('Dr.')
            expect(person.firstName).toBe('Bruce')
            expect(person.nameAddition).toBe('von')
            expect(person.lastName).toBe('Wayne')
            expect(person.ldap).toBe('bvwayne')
            expect(person.room).toBe(1000)
        })
        it('should use default value for undefined', function() {
            const person = new Person()
            expect(person.title).toBe('')
        })
    })

    describe('toObject function', function() {
        it('should should map attributes to space-separated attributes', function() {
            const person = personData[0]
            expect(person.toObject()).toEqual({
                'first name': 'Bruce',
                'last name': 'Wayne',
                'title': 'Dr.',
                'name addition': 'von',
                'ldapuser': 'bvwayne'
            })
        })
    })

    describe('parseCsvThroughStream function', function() {
        it('should parse the test data', function(cb) {
            const csvFileStream = fs.createReadStream('data/persons.csv', {flags: 'r', encoding: 'utf8'})
            return highland(csvFileStream)
                .through(Person.parseCsvThroughStream())
                .toArray((persons) => {
                    expect(persons.length).toBe(33)
                    return cb()
                })
        })
    })

    describe('parseCsvLineArray function', function() {
        it('should return an array of Persons', function() {
            const result = Person.parseCsvLineArray(['1000', 'Bruce Wayne (bwayne)', 'Blade Daywalker (bdaywalker)'])
            expect(result.length).toBe(2)
            expect(result[0]).toEqual(jasmine.any(Person))
            expect(result[0].firstName).toBe('Bruce')
        })
        it('should not create a Person from an empty field', function() {
            const result = Person.parseCsvLineArray(['1000', 'Bruce Wayne (bwayne)', ''])
            expect(result.length).toBe(1)
        })
    })

    describe('parseCsvPersonString function', function() {
        it('should return undefined for an empty string', function() {
            expect(Person.parseCsvPersonString('')).toBeUndefined()
        })
        it('should parse a simple name', function() {
            expect(Person.parseCsvPersonString('Bruce Wayne (bwayne)')).toEqual({
                firstName: 'Bruce',
                lastName: 'Wayne',
                ldap: 'bwayne'
            })
        })
        it('should parse a name with special characters', function() {
            expect(Person.parseCsvPersonString('Brüß Wäyne (bwaeyne)')).toEqual({
                firstName: 'Brüß',
                lastName: 'Wäyne',
                ldap: 'bwaeyne'
            })
        })
        it('should parse a name with title', function() {
            expect(Person.parseCsvPersonString('Dr. Bruce Wayne (bwayne)')).toEqual({
                title: 'Dr.',
                firstName: 'Bruce',
                lastName: 'Wayne',
                ldap: 'bwayne'
            })
        })
        it('should parse a name with addition', function() {
            expect(Person.parseCsvPersonString('Bruce von Wayne (bvwayne)')).toEqual({
                firstName: 'Bruce',
                nameAddition: 'von',
                lastName: 'Wayne',
                ldap: 'bvwayne'
            })
        })
        it('should parse a name with title and addition', function() {
            expect(Person.parseCsvPersonString('Dr. Bruce von Wayne (bvwayne)')).toEqual({
                title: 'Dr.',
                firstName: 'Bruce',
                nameAddition: 'von',
                lastName: 'Wayne',
                ldap: 'bvwayne'
            })
        })
    })

})
