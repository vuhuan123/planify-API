/* eslint-disable no-console */
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createNew = async (req, res, next) => {
    const schema = Joi.object({
         boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
         title: Joi.string().required().min(3).max(50).trim().strict()
    })
    try {
        await schema.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        next( new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message) )
    }

}

const update = async (req, res, next) => {
    const schema = Joi.object({
        // boardId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        title: Joi.string().min(3).max(50).trim(),
        cardOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    })

    try {
        await schema.validateAsync(req.body, {
            abortEarly: false,
            allowUnknown: true // doi voi cac truong khong co trong schema nhung co trong body thi van cho phep
        })
        next()
        // res.status(StatusCodes.CREATED).json({ mes: 'helo everyone Post', code : StatusCodes.CREATED })
    } catch (error) {
        next( new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message) )
    }

}

const deleteColumn = async (req, res, next) => {
    const schema = Joi.object({
        id : Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    })

    try {
        await schema.validateAsync(req.params)
        next()
        // res.status(StatusCodes.CREATED).json({ mes: 'helo everyone Post', code : StatusCodes.CREATED })
    } catch (error) {
        next( new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message) )
    }

}

export const columnValidation = {
    createNew,
    update,
    deleteColumn
}