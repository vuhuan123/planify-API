import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { getDB } from '~/config/mongodb'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE } from '~/utils/validators'


const USER_ROLES = {
    CLIENT: 'client',
    ADMIN: 'admin'
}

//define collection name

const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
    email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
    password: Joi.string().required(),
    username : Joi.string().required().trim().strict(),
    displayName : Joi.string().required().trim().strict(),
    avatar : Joi.string().default(null),
    role: Joi.string().valid(...Object.values(USER_ROLES)).default(USER_ROLES.CLIENT),
    isActive: Joi.boolean().default(false),
    verifyToken: Joi.string(),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'email', 'username', 'createdAt']
const validateBeforeCreate = async (data) => {
    return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)
        const createdUser = await getDB()
            .collection(USER_COLLECTION_NAME)
            .insertOne(validData)
        return createdUser
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`)
    }
}

const findOneById = async (id) => {
    try {
       const user = await getDB()
            .collection(USER_COLLECTION_NAME)
            .findOne({ _id: new ObjectId(id)
        })
        return user
    } catch (error) {
        throw new Error(`Error finding user by ID: ${error.message}`)
    }
}

const findOneByEmail = async (email) => {
    try {
        const user = await getDB()
            .collection(USER_COLLECTION_NAME)
            .findOne({ email })
        return user
    } catch (error) {
        throw new Error(`Error finding user by email: ${error.message}`)
    }
}

const updateById = async (id, data) => {
    try {
        Object.keys(data).forEach((key) => {
            if (INVALID_UPDATE_FIELDS.includes(key)) {
                delete data[key]
            }
        })

        const result = await getDB()
            .collection(USER_COLLECTION_NAME)
            .findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: data },
            { returnDocument: 'after' }
        )
        return result
    } catch (error) {
        throw new Error(`Error updating user: ${error.message}`)
    }
}

export const userModel = {
    createNew,
    findOneById,
    findOneByEmail,
    updateById,
    USER_ROLES,
    USER_COLLECTION_NAME,
    USER_COLLECTION_SCHEMA
}