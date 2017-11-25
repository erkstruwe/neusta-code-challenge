import {Person} from './Person'

describe('Person class', function() {
    beforeEach(function() {
        this.personData = [
            new Person({
                title: 'Dr.',
                firstName: 'Bruce',
                nameAddition: 'von',
                lastName: 'Wayne',
                ldap: 'bvwayne',
                room: '1000',
            }),
            new Person({
                firstName: 'Blade',
                lastName: 'Daywalker',
                ldap: 'bdaywalker',
                room: '1000',
            }),
            new Person({
                firstName: 'Mickey',
                lastName: 'Mouse',
                ldap: 'mmouse',
                room: '1001',
            }),
        ]
    })

    describe('set csvPersonString virtual', function() {
        beforeEach(function() {
            this.person = new Person()
            this.person.room = '1000'
        })

        it('should parse an invalid csvPersonString to an invalid person', function() {
            this.person.csvPersonString = 'Bruce'
            expect(this.person.validateSync()).toBeDefined()
        })
        it('should parse a simple name to a valid person', function() {
            this.person.csvPersonString = 'Bruce Wayne (bwayne)'
            expect(this.person).toEqual(jasmine.objectContaining({
                firstName: 'Bruce',
                lastName: 'Wayne',
                ldap: 'bwayne',
            }))
            expect(this.person.validateSync()).toBeUndefined()
        })
        it('should parse a name with multiple first names to a valid person', function() {
            this.person.csvPersonString = 'Bruce Alpha Beta Wayne (bwayne)'
            expect(this.person).toEqual(jasmine.objectContaining({
                firstName: 'Bruce Alpha Beta',
                lastName: 'Wayne',
                ldap: 'bwayne',
            }))
            expect(this.person.validateSync()).toBeUndefined()
        })
        it('should parse a name with special characters to a valid person', function() {
            this.person.csvPersonString = 'Brüß Wäyne©®™ (bwaeyne)'
            expect(this.person).toEqual(jasmine.objectContaining({
                firstName: 'Brüß',
                lastName: 'Wäyne©®™',
                ldap: 'bwaeyne',
            }))
            expect(this.person.validateSync()).toBeUndefined()
        })
        it('should parse a name with title to a valid person', function() {
            this.person.csvPersonString = 'Dr. Bruce Wayne (bwayne)'
            expect(this.person).toEqual(jasmine.objectContaining({
                title: 'Dr.',
                firstName: 'Bruce',
                lastName: 'Wayne',
                ldap: 'bwayne',
            }))
            expect(this.person.validateSync()).toBeUndefined()
        })
        it('should parse a name with addition to a valid person', function() {
            this.person.csvPersonString = 'Bruce von Wayne (bvwayne)'
            expect(this.person).toEqual(jasmine.objectContaining({
                firstName: 'Bruce',
                nameAddition: 'von',
                lastName: 'Wayne',
                ldap: 'bvwayne',
            }))
            expect(this.person.validateSync()).toBeUndefined()
        })
        it('should parse a name with title and addition to a valid person', function() {
            this.person.csvPersonString = 'Dr. Bruce von Wayne (bvwayne)'
            expect(this.person).toEqual(jasmine.objectContaining({
                title: 'Dr.',
                firstName: 'Bruce',
                nameAddition: 'von',
                lastName: 'Wayne',
                ldap: 'bvwayne',
            }))
            expect(this.person.validateSync()).toBeUndefined()
        })
        it('should parse a name with title and addition and multiple first names to a valid person', function() {
            this.person.csvPersonString = 'Dr. Bruce Alpha Beta von Wayne (bvwayne)'
            expect(this.person).toEqual(jasmine.objectContaining({
                title: 'Dr.',
                firstName: 'Bruce Alpha Beta',
                nameAddition: 'von',
                lastName: 'Wayne',
                ldap: 'bvwayne',
            }))
            expect(this.person.validateSync()).toBeUndefined()
        })
    })

    describe('toJSON method', function() {
        it('should should map attributes to space-separated attributes', function() {
            expect(this.personData[0].toJSON()).toEqual({
                'first name': 'Bruce',
                'last name': 'Wayne',
                'title': 'Dr.',
                'name addition': 'von',
                'ldapuser': 'bvwayne',
            })
        })
        it('should include attributes that are undefined in the document', function() {
            expect(this.personData[1].toJSON()).toEqual({
                'first name': 'Blade',
                'last name': 'Daywalker',
                'title': '',
                'name addition': '',
                'ldapuser': 'bdaywalker',
            })
        })
    })

})
