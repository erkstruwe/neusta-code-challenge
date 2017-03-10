const mongoose = require('mongoose')
const lodash = require('lodash')
const highland = require('highland')

const schema = new mongoose.Schema(
    {
        title: {
            type: String,
            enum: ['Dr.']
        },
        firstName: {
            type: String,
            required: true
        },
        nameAddition: {
            type: String,
            enum: ['von', 'van', 'de']
        },
        lastName: {
            type: String,
            required: true
        },
        ldap: {
            type: String,
            required: true
        },
        room: {
            type: String,
            required: true,
            minlength: 4,
            maxlength: 4
        }
    }
)

schema.virtual('fullName')
    .get(function () {
            return lodash.chain([this.title, this.firstName, this.nameAddition, this.lastName])
                .compact()
                .join(' ')
                .value()
        }
    )

schema.virtual('csvPersonString')
    .set(function (csvPersonString) {
            const result = csvPersonString.match(/((Dr\.) )?((.+?) )((van|von|de) )?(([^ ]+) )(\((.+)\))/)
            if (result) {
                this.title = result[2]
                this.firstName = result[4]
                this.nameAddition = result[6]
                this.lastName = result[8]
                this.ldap = result[10]
            }
        }
    )

schema.methods = {
    forOutput: function () {
        return {
            'first name': lodash.get(this, 'firstName', ''),
            'last name': lodash.get(this, 'lastName', ''),
            'title': lodash.get(this, 'title', ''),
            'name addition': lodash.get(this, 'nameAddition', ''),
            'ldapuser': lodash.get(this, 'ldap', '')
        }
    }
}

schema.statics = {
    parseCsvThroughStream: function () {
        return highland.pipeline((csvLineArraysStream) => {
            return csvLineArraysStream
                .flatMap(Person.parseCsvLineArray)
        })
    },
    parseCsvLineArray: function (csvLineArray) {
        const room = csvLineArray[0]
        return lodash.chain(csvLineArray)
            .drop(1)
            .compact()
            .map((csvPersonString) => {
                let person = new Person
                person.room = room
                person.csvPersonString = csvPersonString
                return person
            })
            .value()
    }
}

const Person = mongoose.model('Person', schema)

module.exports = Person
