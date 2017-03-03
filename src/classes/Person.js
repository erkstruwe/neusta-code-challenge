const lodash = require('lodash')
const highland = require('highland')
const csvParse = require('csv-parse')

module.exports = class Person {
    constructor(data) {
        const attributes = [
            'firstName',
            'lastName',
            'title',
            'nameAddition',
            'ldap',
            'room'
        ]

        Object.assign(this, lodash.pick(data, attributes))
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
        return highland.pipeline((csvStream) => {
            return csvStream
                .through(csvParse())
                .flatMap(this.parseCsvLineArray.bind(this))
                .compact()
                .errors(console.error)
        })
    }

    static parseCsvLineArray(csvLineArray) {
        const room = +csvLineArray[0]
        return lodash.chain(csvLineArray)
            .drop(1)
            .map((csvPersonString) => {
                const personData = this.parseCsvPersonString(csvPersonString)
                if (personData) {
                    return Object.assign(
                        {room},
                        personData
                    )
                }
            })
            .value()
    }

    static parseCsvPersonString(csvPersonString) {
        if (csvPersonString) {
            const result = csvPersonString.match(/.*/)
            return {
                data: result
            }
        }
    }
}
