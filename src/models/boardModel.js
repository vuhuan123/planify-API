import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { getDB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
//Define collection schema

const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(256).trim().strict(),
  // type: Joi.string().valid('public', 'private').default('private'),
  columnOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  createAt: Joi.date().timestamp('javascript').default(Date.now),
  updateAt: Joi.date().timestamp('javascript').default(null),
  _destroyed: Joi.boolean().default(false)
});

const validaBeforeInsert = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async(data) => {
  try {
    const validatedData = await validaBeforeInsert(data)
    console.log('validatedData', validatedData)
    const createBoadrd = await getDB().collection(BOARD_COLLECTION_NAME).insertOne(validatedData)
    // find id of created board

    return createBoadrd
  } catch (error) {
    throw new Error(error)
  }
}
const findOneById = async (id) => {
  try {
    // convert id to ObjectId type
    const idO = new ObjectId(id)
    // console.log('ida', typeof( ida))
    const idBoard = await getDB().collection(BOARD_COLLECTION_NAME).findOne({ _id: idO })
    return idBoard
  } catch (error) {
    throw new Error(error)
  }
}

export const boardModel = {
    BOARD_COLLECTION_NAME,
    BOARD_COLLECTION_SCHEMA,
    createNew,
    findOneById
}