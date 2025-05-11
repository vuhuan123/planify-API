import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { getDB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { columnModel } from './columnModel.js'
import { cardModel } from './cardModel.js'
import { pagingSkipValue } from '~/utils/algorithms.js'
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
  // Nhung admin cua cai board
  ownerIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  // Nhung nguoi co quyen truy cap board
  memberIds: Joi.array().items(
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

// lay 1 Columnid ra khoi columnOrderIds
const pullColumnOrderIds = async (column) => {
  try {
    const result = await getDB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(column.boardId) },
      { $pull : { columnOrderIds: new ObjectId(column._id) } },
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
    if (updateData.columnOrderIds) {
      updateData.columnOrderIds = updateData.columnOrderIds.map((id) => new ObjectId(id)) // convert columnOrderIds to ObjectId type
    }
    // console.log('updateData', updateData)
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

const getBoards = async (userId, page, itemsPerPage) => {
  try {
    const queryCondition = [
      // Dieu kien 1: Board chua bi xoa
      { _destroyed: false },
      // dkieu kien 2: userId phai la owner hoac member cua board
      { $or: [
        { ownerIds: { $all: [new ObjectId(userId)] } },
        { memberIds: { $all: [new ObjectId(userId)] } }
      ] }
    ]
    const query = await getDB().collection(BOARD_COLLECTION_NAME).aggregate(
      [
      { $match : { $and: queryCondition } },
      // sort title cua  board theo A-Z
      { $sort : { title : 1 } },
      // $facet de xu ly nhieu luong trong mot query
      { $facet : {
        // Luong thu 1 : query board
        'queryBoards' : [
          { $skip : pagingSkipValue(page, itemsPerPage) },
          { $limit : itemsPerPage }
        ],
        // Luong thu 2 : query tong so luong ban ghi board trong db va tra ve bien' countedAllBoard
        'queryTotalBoard' : [
          { $count : 'countedAllBoard' }
        ]
      } }
    ],
    { collation : { locale : 'en' } }
  ).toArray()
  const res = query[0]
  return {
    boards : res.queryBoards || [],
    totalBoard : res.queryTotalBoard[0]?.countedAllBoard || 0
  }
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
  update,
  pullColumnOrderIds,
  getBoards
}