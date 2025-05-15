import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { getDB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { INITATION_TYPES, BOARD_INVITATION_STATUS } from '~/utils/constants'

const INVITATION_COLLECTION_NAME = 'invitations'
const INVITATION_COLLECTION_SCHEMA = Joi.object({
    inviterId : Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    inviteeId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    type : Joi.string().required().valid(...Object.values(INITATION_TYPES)),
    boardInvitation: Joi.object({
        boardId : Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        status :  Joi.string().required().valid(...Object.values(BOARD_INVITATION_STATUS))
    }).optional(),
    createAt: Joi.date().timestamp('javascript').default(Date.now),
    updateAt: Joi.date().timestamp('javascript').default(null),
    _destroyed: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'inviterId', 'inviteeId', 'type', 'createAt']
const validaBeforeCreate = async (data) => {
    return await INVITATION_COLLECTION_SCHEMA.validateAsync(data, { abortEarly : false })
}
const createNewBoardInvitation = async (date) => {
    try {
        const validData = await validaBeforeCreate(date)

        let newInvitationToAdd = {
            ...validData,
            inviterId : new ObjectId(validData.inviterId),
            inviteeId : new ObjectId(validData.inviteeId)
        }
        if (validData.boardInvitation) {
            newInvitationToAdd.boardInvitation = {
                ...validData.boardInvitation,
                boardId : new ObjectId(validData.boardInvitation.boardId)
            }
        }
        const createdInvitation = await getDB().collection(INVITATION_COLLECTION_NAME).insertOne(newInvitationToAdd)
        return createdInvitation
    } catch (error) {
        throw new Error(error)
    }
}

const findOneById = async (id) => {
  try {
    // convert id to ObjectId type
    const idO = new ObjectId(id)
    // console.log('ida', typeof( ida))
    const res = await getDB().collection(INVITATION_COLLECTION_NAME).findOne({ _id: idO })
    return res
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (invitationId, updateData) => {
  try {
    // Loc những trường không cho pheps trong updateData
    Object.keys(updateData).forEach((key) => {
      if (INVALID_UPDATE_FIELDS.includes(key)) {
        delete updateData[key]
      }
    })

    if (updateData.boardInvitation) {
      updateData.boardInvitation = {
        ...updateData.boardInvitation,
        boardId : new ObjectId(updateData.boardInvitation.boardId)
      }
    }
    // console.log('updateData', updateData)
    // Add updatedAt field
    const result = await getDB().collection(INVITATION_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(invitationId) },
      { $set: updateData },
      { returnDocument: 'after' } // Return the updated document
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const invitationModal = {
    INVITATION_COLLECTION_NAME,
    INVITATION_COLLECTION_SCHEMA,
    createNewBoardInvitation,
    findOneById,
    update
}