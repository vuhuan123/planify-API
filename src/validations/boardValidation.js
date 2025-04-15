/* eslint-disable no-console */
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'


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

export const boardValidation = {
    createNew,
    update
}