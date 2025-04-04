import Joi from 'joi'

//Define collection schema

const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = ({
    title : Joi.string().required().min(3).max(50).trim().strict(),
    slug : Joi.string().required().min(3).trim().strict(),
    description : Joi.string().required().min(3).max(256).trim().strict(),
    // type : Joi.string().valid('public', 'private').default('private'),
    columnOrderIds: Joi.array().items(Joi.string()).default([]),
    createAt : Joi.date().timestamp('javascript').default(Date.now),
    updateAt : Joi.date().timestamp('javascript').default(null),
   _destroyed : Joi.boolean().default(false),
})

export const boardModel = {
    BOARD_COLLECTION_NAME,
    BOARD_COLLECTION_SCHEMA

}