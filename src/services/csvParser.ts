import * as highland from 'highland'
import * as lodash from 'lodash'

import {IPersonModel, Person} from '../classes/Person'

export function personThroughStream() {
    return highland.pipeline((csvLineArraysStream) => {
        return csvLineArraysStream
            .flatMap(personLineArray)
    })
}

export function personLineArray(csvLineArray) {
    const room = csvLineArray[0]
    return lodash.chain(csvLineArray)
        .drop(1)
        .compact()
        .map((csvPerson: string) => {
            const person: IPersonModel = new Person()
            person.room = room
            person.csvPersonString = csvPerson
            return person
        })
        .value()
}
