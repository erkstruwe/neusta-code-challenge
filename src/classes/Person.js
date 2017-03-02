const lodash = require('lodash')

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
}
