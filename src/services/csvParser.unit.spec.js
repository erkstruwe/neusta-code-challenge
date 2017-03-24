const fs = require('fs')
const highland = require('highland')
const csvParse = require('csv-parse')

const Person = require('../classes/Person')
const csvParser = require('./csvParser')

describe('csvParser service', function() {
    beforeEach(function() {
        this.personData = [
            new Person({
                title: 'Dr.',
                firstName: 'Bruce',
                nameAddition: 'von',
                lastName: 'Wayne',
                ldap: 'bvwayne',
                room: '1000'
            }),
            new Person({
                firstName: 'Blade',
                lastName: 'Daywalker',
                ldap: 'bdaywalker',
                room: '1000'
            }),
            new Person({
                firstName: 'Mickey',
                lastName: 'Mouse',
                ldap: 'mmouse',
                room: '1001'
            })
        ]
    })

    describe('personThroughStream', function() {
        it('should parse the difficult test data', function(cb) {
            const csvLineArraysStream = fs
                .createReadStream('data/persons.csv', {flags: 'r', encoding: 'utf8'})
                .pipe(csvParse())
            return highland(csvLineArraysStream)
                .through(csvParser.personThroughStream())
                .toArray((persons) => {
                    expect(persons.length).toBe(33)
                    expect(persons[0]).toEqual(jasmine.any(Person))
                    expect(persons[0]).toEqual(jasmine.objectContaining({
                        firstName: 'Dennis Anton Berta',
                        lastName: 'Fischer',
                        ldap: 'dfischer',
                        room: '1111'
                    }))
                    return cb()
                })
        })
        it('should parse the original test data', function(cb) {
            const csvLineArraysStream = fs
                .createReadStream('data/personsOriginal.csv', {flags: 'r', encoding: 'utf8'})
                .pipe(csvParse())
            return highland(csvLineArraysStream)
                .through(csvParser.personThroughStream())
                .toArray((persons) => {
                    expect(persons.length).toBe(33)
                    expect(persons[0]).toEqual(jasmine.any(Person))
                    expect(persons[0]).toEqual(jasmine.objectContaining({
                        firstName: 'Dennis',
                        lastName: 'Fischer',
                        ldap: 'dfischer',
                        room: '1111'
                    }))
                    return cb()
                })
        })
    })

    describe('personLineArray', function() {
        it('should return an array of Persons', function() {
            const result = csvParser.personLineArray(['1000', 'Bruce Wayne (bwayne)', 'Blade Daywalker (bdaywalker)', ''])
            expect(result.length).toBe(2)
            expect(result[0]).toEqual(jasmine.any(Person))
            expect(result[0]).toEqual(jasmine.objectContaining({
                firstName: 'Bruce',
                lastName: 'Wayne',
                ldap: 'bwayne',
                room: '1000'
            }))
            expect(result[1]).toEqual(jasmine.any(Person))
            expect(result[1]).toEqual(jasmine.objectContaining({
                firstName: 'Blade',
                lastName: 'Daywalker',
                ldap: 'bdaywalker',
                room: '1000'
            }))
        })
    })

})
