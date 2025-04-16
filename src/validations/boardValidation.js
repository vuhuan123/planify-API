/* eslint-disable no-console */
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createNew = async (req, res, next) => {
    const schema = Joi.object({
        title : Joi.string().required().min(3).max(50).trim().strict(),
        description : Joi.string().required().min(3).max(256).trim().strict(),
        type : Joi.string().valid('public', 'private').required()
    })

    try {
        // Validate the request body against the schema
        await schema.validateAsync(req.body, { abortEarly: false })
        // If validation is successful, proceed to the next middleware or route handler
        next()
        // res.status(StatusCodes.CREATED).json({ mes: 'helo everyone Post', code : StatusCodes.CREATED })
    } catch (error) {
        // const errorsMessage = new Error(error).message
        // const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorsMessage)
        next( new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message) )
    }

}

const update = async (req, res, next) => {
    const schema = Joi.object({
        title : Joi.string().min(3).max(50).trim().strict(),
        description : Joi.string().min(3).max(256).trim().strict(),
        type : Joi.string().valid('public', 'private')
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

const moveCardToDifferentColumn = async (req, res, next) => {
    const schema = Joi.object({
        currentCardId :  Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        prevColumnId : Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        prevCardOrderIds : Joi.array().required().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)),
        nextColumnId : Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        nextCardOrderIds : Joi.array().required().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    })

    try {
        await schema.validateAsync(req.body, { abortEarly: false })
        next()
        // res.status(StatusCodes.CREATED).json({ mes: 'helo everyone Post', code : StatusCodes.CREATED })
    } catch (error) {
        next( new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message) )
    }
}

export const boardValidation = {
    createNew,
    update,
    moveCardToDifferentColumn
}