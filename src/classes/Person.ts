import * as lodash from 'lodash'
import {Document, Model, model, Schema} from 'mongoose'

export interface IPerson {
    title?: string
    firstName: string
    nameAddition?: string
    lastName: string
    ldap: string
    room: string
}

export interface IPersonModel extends Document, IPerson {
    csvPersonString: string
}

const PersonSchema = new Schema(
    {
        title: {
            type: String,
            enum: ['Dr.'],
        },
        firstName: {
            type: String,
            required: true,
        },
        nameAddition: {
            type: String,
            enum: ['von', 'van', 'de'],
        },
        lastName: {
            type: String,
            required: true,
        },
        ldap: {
            type: String,
            required: true,
        },
        room: {
            type: String,
            required: true,
            minlength: 4,
            maxlength: 4,
        },
    },
    {
        toJSON: {
            transform: (doc, ret) => {
                return {
                    'first name': lodash.get(ret, 'firstName', ''),
                    'last name': lodash.get(ret, 'lastName', ''),
                    'title': lodash.get(ret, 'title', ''),
                    'name addition': lodash.get(ret, 'nameAddition', ''),
                    'ldapuser': lodash.get(ret, 'ldap', ''),
                }
            },
        },
    },
)

PersonSchema.virtual('csvPersonString')
    .set(function(csvPersonString) {
            const result = csvPersonString.match(/((Dr\.) )?((.+?) )((van|von|de) )?(([^ ]+) )(\((.+)\))/)
            if (result) {
                this.title = result[2]
                this.firstName = result[4]
                this.nameAddition = result[6]
                this.lastName = result[8]
                this.ldap = result[10]
            }
        },
    )

export const Person: Model<IPersonModel> = model<IPersonModel>('Person', PersonSchema)
