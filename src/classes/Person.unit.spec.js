const fs = require('fs')

const highland = require('highland')
const csvParse = require('csv-parse')

const Person = require('./Person')
const personData = require('./Person.data')

describe('Person class', function() {

    describe('fullName virtual', function() {
        it('should return the full name', function() {
            expect(personData[0].fullName).toBe('Dr. Bruce von Wayne')
            expect(personData[1].fullName).toBe('Blade Daywalker')
            expect(personData[2].fullName).toBe('Mickey Mouse')
        })
    })

    describe('forOutput method', function() {
        it('should should map attributes to space-separated attributes', function() {
            const person = personData[0]
            expect(person.forOutput()).toEqual(jasmine.objectContaining({
                'first name': 'Bruce',
                'last name': 'Wayne',
                'title': 'Dr.',
                'name addition': 'von',
                'ldapuser': 'bvwayne'
            }))
        })
    })

    describe('parseCsvThroughStream static', function() {
        it('should parse the test data', function(cb) {
            const csvLineArraysStream = fs
                .createReadStream('data/persons.csv', {flags: 'r', encoding: 'utf8'})
                .pipe(csvParse())
            return highland(csvLineArraysStream)
                .through(Person.parseCsvThroughStream())
                .toArray((persons) => {
                    expect(persons.length).toBe(33)
                    return cb()
                })
        })
        it('should parse the original test data', function(cb) {
            const csvLineArraysStream = fs
                .createReadStream('data/personsOriginal.csv', {flags: 'r', encoding: 'utf8'})
                .pipe(csvParse())
            return highland(csvLineArraysStream)
                .through(Person.parseCsvThroughStream())
                .toArray((persons) => {
                    expect(persons.length).toBe(33)
                    return cb()
                })
        })
    })

    describe('parseCsvLineArray static', function() {
        it('should return an array of Persons', function() {
            const result = Person.parseCsvLineArray(['1000', 'Bruce Wayne (bwayne)', 'Blade Daywalker (bdaywalker)'])
            expect(result.length).toBe(2)
            expect(result[0]).toEqual(jasmine.any(Person))
            expect(result[0].firstName).toBe('Bruce')
        })
    })

    describe('parseCsvPersonString static', function() {
        it('should throw for an empty string', function() {
            expect(() => Person.parseCsvPersonString('')).toThrow({statusCode: 400, code: 4, message: jasmine.any(String)})
        })
        it('should throw for a string that does not match', function() {
            expect(() => Person.parseCsvPersonString('Bruce')).toThrow({statusCode: 400, code: 4, message: jasmine.any(String)})
        })
        it('should parse a simple name', function() {
            expect(Person.parseCsvPersonString('Bruce Wayne (bwayne)')).toEqual(jasmine.objectContaining({
                firstName: 'Bruce',
                lastName: 'Wayne',
                ldap: 'bwayne'
            }))
        })
        it('should parse a name with multiple first names', function() {
            expect(Person.parseCsvPersonString('Bruce Anton Berta Wayne (bwayne)')).toEqual(jasmine.objectContaining({
                firstName: 'Bruce Anton Berta',
                lastName: 'Wayne',
                ldap: 'bwayne'
            }))
        })
        it('should parse a name with special characters', function() {
            expect(Person.parseCsvPersonString('Brüß Wäyne©®™ (bwaeyne)')).toEqual(jasmine.objectContaining({
                firstName: 'Brüß',
                lastName: 'Wäyne©®™',
                ldap: 'bwaeyne'
            }))
        })
        it('should parse a name with title', function() {
            expect(Person.parseCsvPersonString('Dr. Bruce Wayne (bwayne)')).toEqual(jasmine.objectContaining({
                title: 'Dr.',
                firstName: 'Bruce',
                lastName: 'Wayne',
                ldap: 'bwayne'
            }))
        })
        it('should parse a name with addition', function() {
            expect(Person.parseCsvPersonString('Bruce von Wayne (bvwayne)')).toEqual(jasmine.objectContaining({
                firstName: 'Bruce',
                nameAddition: 'von',
                lastName: 'Wayne',
                ldap: 'bvwayne'
            }))
        })
        it('should parse a name with title and addition', function() {
            expect(Person.parseCsvPersonString('Dr. Bruce von Wayne (bvwayne)')).toEqual(jasmine.objectContaining({
                title: 'Dr.',
                firstName: 'Bruce',
                nameAddition: 'von',
                lastName: 'Wayne',
                ldap: 'bvwayne'
            }))
        })
        it('should parse a name with title and addition and multiple first names', function() {
            expect(Person.parseCsvPersonString('Dr. Bruce Anton Berta von Wayne (bvwayne)')).toEqual(jasmine.objectContaining({
                title: 'Dr.',
                firstName: 'Bruce Anton Berta',
                nameAddition: 'von',
                lastName: 'Wayne',
                ldap: 'bvwayne'
            }))
        })
    })

})
