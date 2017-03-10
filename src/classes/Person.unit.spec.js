const fs = require('fs')
const highland = require('highland')
const csvParse = require('csv-parse')

const Person = require('./Person')
const personData = require('./Person.data')

describe('Person class', function() {

    describe('get fullName virtual', function() {
        it('should return the full name', function() {
            expect(personData[0].fullName).toBe('Dr. Bruce von Wayne')
            expect(personData[1].fullName).toBe('Blade Daywalker')
            expect(personData[2].fullName).toBe('Mickey Mouse')
        })
    })

    describe('set csvPersonString virtual', function() {
        beforeEach(function() {
            this.person = new Person()
            this.person.room = '1000'
        })

        it('should parse an invalid csvPersonString to an invalid person', function() {
            this.person.csvPersonString = 'Bruce'
            expect(this.person.validateSync()).toBeDefined()
        })
        it('should parse a simple name to a valid person', function() {
            this.person.csvPersonString = 'Bruce Wayne (bwayne)'
            expect(this.person).toEqual(jasmine.objectContaining({
                firstName: 'Bruce',
                lastName: 'Wayne',
                ldap: 'bwayne'
            }))
            expect(this.person.validateSync()).toBeUndefined()
        })
        it('should parse a name with multiple first names to a valid person', function() {
            this.person.csvPersonString = 'Bruce Alpha Beta Wayne (bwayne)'
            expect(this.person).toEqual(jasmine.objectContaining({
                firstName: 'Bruce Alpha Beta',
                lastName: 'Wayne',
                ldap: 'bwayne'
            }))
            expect(this.person.validateSync()).toBeUndefined()
        })
        it('should parse a name with special characters to a valid person', function() {
            this.person.csvPersonString = 'Brüß Wäyne©®™ (bwaeyne)'
            expect(this.person).toEqual(jasmine.objectContaining({
                firstName: 'Brüß',
                lastName: 'Wäyne©®™',
                ldap: 'bwaeyne'
            }))
            expect(this.person.validateSync()).toBeUndefined()
        })
        it('should parse a name with title to a valid person', function() {
            this.person.csvPersonString = 'Dr. Bruce Wayne (bwayne)'
            expect(this.person).toEqual(jasmine.objectContaining({
                title: 'Dr.',
                firstName: 'Bruce',
                lastName: 'Wayne',
                ldap: 'bwayne'
            }))
            expect(this.person.validateSync()).toBeUndefined()
        })
        it('should parse a name with addition to a valid person', function() {
            this.person.csvPersonString = 'Bruce von Wayne (bvwayne)'
            expect(this.person).toEqual(jasmine.objectContaining({
                firstName: 'Bruce',
                nameAddition: 'von',
                lastName: 'Wayne',
                ldap: 'bvwayne'
            }))
            expect(this.person.validateSync()).toBeUndefined()
        })
        it('should parse a name with title and addition to a valid person', function() {
            this.person.csvPersonString = 'Dr. Bruce von Wayne (bvwayne)'
            expect(this.person).toEqual(jasmine.objectContaining({
                title: 'Dr.',
                firstName: 'Bruce',
                nameAddition: 'von',
                lastName: 'Wayne',
                ldap: 'bvwayne'
            }))
            expect(this.person.validateSync()).toBeUndefined()
        })
        it('should parse a name with title and addition and multiple first names to a valid person', function() {
            this.person.csvPersonString = 'Dr. Bruce Alpha Beta von Wayne (bvwayne)'
            expect(this.person).toEqual(jasmine.objectContaining({
                title: 'Dr.',
                firstName: 'Bruce Alpha Beta',
                nameAddition: 'von',
                lastName: 'Wayne',
                ldap: 'bvwayne'
            }))
            expect(this.person.validateSync()).toBeUndefined()
        })
    })

    describe('forOutput method', function() {
        it('should should map attributes to space-separated attributes', function() {
            const person = personData[0]
            expect(person.forOutput()).toEqual({
                'first name': 'Bruce',
                'last name': 'Wayne',
                'title': 'Dr.',
                'name addition': 'von',
                'ldapuser': 'bvwayne'
            })
        })
        it('should include attributes that are undefined in the document', function() {
            const person = personData[1]
            expect(person.forOutput()).toEqual({
                'first name': 'Blade',
                'last name': 'Daywalker',
                'title': '',
                'name addition': '',
                'ldapuser': 'bdaywalker'
            })
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
            const result = Person.parseCsvLineArray(['1000', 'Bruce Wayne (bwayne)', 'Blade Daywalker (bdaywalker)', ''])
            expect(result.length).toBe(2)
            expect(result[0]).toEqual(jasmine.any(Person))
            expect(result[0].firstName).toBe('Bruce')
            expect(result[0].room).toBe('1000')
            expect(result[1]).toEqual(jasmine.any(Person))
            expect(result[1].firstName).toBe('Blade')
            expect(result[1].room).toBe('1000')
        })
    })

})
