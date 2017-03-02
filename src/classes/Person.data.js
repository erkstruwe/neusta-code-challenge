const Person = require('./Person')

module.exports = [
    new Person({
        firstName: 'Bruce',
        lastName: 'Wayne',
        title: 'Phd',
        nameAddition: 'von',
        ldap: 'bvwayne',
        room: 1000
    }),
    new Person({
        firstName: 'Blade',
        lastName: 'Daywalker',
        title: '',
        nameAddition: '',
        ldap: 'bdaywalker',
        room: 1000
    }),
    new Person({
        firstName: 'Mickey',
        lastName: 'Mouse',
        title: '',
        nameAddition: '',
        ldap: 'mmouse',
        room: 1001
    })
]
