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

schema.virtual('fullName').get(function () {
    return lodash.chain([this.title, this.firstName, this.nameAddition, this.lastName])
        .compact()
        .join(' ')
        .value()
})

schema.methods = {
    forOutput: function() {
        return {
            'first name': this.firstName,
            'last name': this.lastName,
            'title': this.title,
            'name addition': this.nameAddition,
            'ldapuser': this.ldap
        }
    }
}

schema.statics = {
    parseCsvThroughStream: function() {
        return highland.pipeline((csvLineArraysStream) => {
            return csvLineArraysStream
                .flatMap(Person.parseCsvLineArray)
        })
    },
    parseCsvLineArray: function(csvLineArray) {
        const room = csvLineArray[0]
        return lodash.chain(csvLineArray)
            .drop(1)
            .map((csvPersonString) => csvPersonString ? Person.parseCsvPersonString(csvPersonString, room) : null)
            .compact()
            .value()
    },
    parseCsvPersonString: function(csvPersonString, room) {
        if (!csvPersonString) {
            throw {statusCode: 400, code: 4, message: 'Invalid person string \'' + csvPersonString + '\''}
        }
        const result = csvPersonString.match(/((Dr\.) )?((.+?) )((van|von|de) )?(([^ ]+) )(\((.+)\))/)
        if (!result) {
            throw {statusCode: 400, code: 4, message: 'Invalid person string \'' + csvPersonString + '\''}
        }
        return new Person({
            title: result[2],
            firstName: result[4],
            nameAddition: result[6],
            lastName: result[8],
            ldap: result[10],
            room
        })
    }
}

const Person = mongoose.model('Person', schema)

module.exports = Person
