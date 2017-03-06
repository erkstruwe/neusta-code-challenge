const Person = require('./Person')

module.exports = [
    new Person({title:'Dr.', firstName: 'Bruce', nameAddition: 'von', lastName: 'Wayne', ldap: 'bvwayne', room: '1000'}),
    new Person({firstName: 'Blade', lastName: 'Daywalker', ldap: 'bdaywalker', room: '1000'}),
    new Person({firstName: 'Mickey', lastName: 'Mouse', ldap: 'mmouse', room: '1001'})
]
