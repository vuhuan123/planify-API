import Joi from 'joi'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { ObjectId } from 'mongodb'
// import { columnModel } from './columnModel.js'
// import { cardModel } from './cardModel.js'
import { getDB } from '~/config/mongodb'
// Define Collection (name & schema)
const CARD_COLLECTION_NAME = 'cards'
const INVALID_UPDATE_FIELDS = ['_id', 'createAt', 'boardId']
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(),
  cover: Joi.string().default(null),
  memberIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
  comments: Joi.array().items({
    userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    userEmail: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
    userAvatar: Joi.string(),
    userDisplayName: Joi.string(),
    content: Joi.string(),
    commentAt: Joi.date().timestamp()
  }).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validaBeforeInsert = async (data) => {
  return await CARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}
const createNew = async (data) => {
  try {
    const validatedData = await validaBeforeInsert(data)
    const newCardToAdd = {
      ...validatedData,
      boardId: new ObjectId(validatedData.boardId), // convert boardId to ObjectId type
      columnId: new ObjectId(validatedData.columnId) // convert columnId to ObjectId type
    }
    const createCard = await getDB().collection(CARD_COLLECTION_NAME).insertOne(newCardToAdd)
    // find id of created board

    return createCard
  } catch (error) {
    throw new Error(error)
  }
}
const findOneById = async (id) => {
  try {
    // convert id to ObjectId type
    const idO = new ObjectId(id)
    // console.log('ida', typeof( ida))
    const idBoard = await getDB().collection(CARD_COLLECTION_NAME).findOne({ _id: idO })
    return idBoard
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (cardId, updateData) => {
  try {
    // Loc những trường không cho pheps trong updateData
    Object.keys(updateData).forEach((key) => {
      if (INVALID_UPDATE_FIELDS.includes(key)) {
        delete updateData[key]
      }
    })
    if (updateData.columnId) {
      updateData.columnId = new ObjectId(updateData.columnId) // convert columnId to ObjectId type
    }
    // Add updatedAt field
    const result = await getDB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(cardId) },
      { $set: updateData },
      { returnDocument: 'after' } // Return the updated document
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteManyByColumnId = async (id) => {
  try {
    const idO = new ObjectId(id)
    const result = await getDB().collection(CARD_COLLECTION_NAME).deleteMany({ columnId: idO })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const unshiftNewComment = async (cardId, commentData) => {
  try {
    const res = await getDB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(cardId) },
      { $push : { comments: { $each: [commentData], $position: 0 } } },
      { returnDocument: 'after' }
    )
    return res
  } catch (error) {throw new Error(error)}
}

const updateMembers = async (cardId, incomingMemberInfor) => {
  try {
    let updateCon = {}
    if (incomingMemberInfor.action === 'ADD') {
      updateCon = { $push : { memberIds: new ObjectId(incomingMemberInfor.userId) } }
    }
    if (incomingMemberInfor.action === 'REMOVE') {
      updateCon = { $pull : { memberIds: new ObjectId(incomingMemberInfor.userId) } }
    }

    const res = await getDB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(cardId) },
      updateCon,
      { returnDocument: 'after' }
    )
    return res
  } catch (error) {
    throw new Error(error)
  }
}

export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  validaBeforeInsert,
  update,
  deleteManyByColumnId,
  unshiftNewComment,
  updateMembers
}