const lodash = require('lodash')
const highland = require('highland')

const Person = require('../classes/Person')

const personThroughStream = () => {
    return highland.pipeline((csvLineArraysStream) => {
        return csvLineArraysStream
            .flatMap(personLineArray)
    })
}

const personLineArray = (csvLineArray) => {
    const room = csvLineArray[0]
    return lodash.chain(csvLineArray)
        .drop(1)
        .compact()
        .map((csvPersonString) => {
            let person = new Person()
            person.room = room
            person.csvPersonString = csvPersonString
            return person
        })
        .value()
}

module.exports = {
    personThroughStream,
    personLineArray
}
