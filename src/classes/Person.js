const lodash = require('lodash')
const highland = require('highland')

module.exports = class Person {
    constructor(title = '', firstName = '', nameAddition = '', lastName = '', ldap = '', room = null) {
        Object.assign(this, {title, firstName, nameAddition, lastName, ldap, room})
    }

    toObject() {
        return {
            'first name': this.firstName,
            'last name': this.lastName,
            'title': this.title,
            'name addition': this.nameAddition,
            'ldapuser': this.ldap
        }
    }

    static parseCsvThroughStream() {
        return highland.pipeline((csvLineArraysStream) => {
            return csvLineArraysStream
                .flatMap(this.parseCsvLineArray.bind(this))
        })
    }

    static parseCsvLineArray(csvLineArray) {
        const room = +csvLineArray[0]
        return lodash.chain(csvLineArray)
            .drop(1)
            .map((csvPersonString) => {
                const personData = this.parseCsvPersonString(csvPersonString)
                if (personData) {
                    return new Person(
                        personData.title,
                        personData.firstName,
                        personData.nameAddition,
                        personData.lastName,
                        personData.ldap,
                        room
                    )
                }
            })
            .compact()
            .value()
    }

    static parseCsvPersonString(csvPersonString) {
        if (csvPersonString) {
            const result = csvPersonString.match(/((Dr\.) )?((.+?) )((van|von|de) )?(([^ ]+) )(\((.+)\))/)
            return lodash.omitBy(
                {
                    title: result[2],
                    firstName: result[4],
                    nameAddition: result[6],
                    lastName: result[8],
                    ldap: result[10]
                },
                lodash.isUndefined
            )
        }
    }
}
