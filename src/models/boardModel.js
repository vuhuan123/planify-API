import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { getDB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { columnModel } from './columnModel.js'
import { cardModel } from './cardModel.js'
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
  _destroyed: Joi.boolean().default(false),
  type: Joi.string().valid('public', 'private').required()
})

const INVALID_UPDATE_FIELDS = ['_id', 'createAt']

const validaBeforeInsert = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validatedData = await validaBeforeInsert(data)
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

const getDetails = async (id) => {
  try {
    // console.log('ida', typeof( ida))
    const result = await getDB().collection(BOARD_COLLECTION_NAME).aggregate([
      {
        $match: {
          _id: new ObjectId(id),
          _destroyed: false
        }
      },
      {
        $lookup: {
          from: columnModel.COLUMN_COLLECTION_NAME,
          localField: '_id',
          foreignField: 'boardId',
          as: 'columns'
        }
      },
      {
        $lookup: {
          from: cardModel.CARD_COLLECTION_NAME,
          localField: '_id',
          foreignField: 'boardId',
          as: 'cards'
        }
      }
    ]).toArray()
    return result[0] || null // Return the first element or an empty object if not found
  } catch (error) {
    throw new Error(error)
  }
}

const pushColumnOrderIds = async (column) => {
  try {
    const result = await getDB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(column.boardId) },
      { $push : { columnOrderIds: new ObjectId(column._id) } },
      { returnDocument: 'after' } // Return the updated document
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (boardId, updateData) => {
  try {
    // Loc những trường không cho pheps trong updateData
    Object.keys(updateData).forEach((key) => {
      if (INVALID_UPDATE_FIELDS.includes(key)) {
        delete updateData[key]
      }
    })
    console.log('updateData', updateData)
    // Add updatedAt field
    const result = await getDB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(boardId) },
      { $set : updateData },
      { returnDocument: 'after' } // Return the updated document
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails,
  pushColumnOrderIds,
  update
}