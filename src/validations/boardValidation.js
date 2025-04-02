/* eslint-disable no-console */
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'


const createNew = async (req, res, next) => {
    const schema = Joi.object({
        title : Joi.string().required().min(3).max(50).trim().strict(),
        description : Joi.string().required().min(3).max(256).trim().strict()
    })

    try {
        // Validate the request body against the schema
        console.log('request.body', req.body)
        await schema.validateAsync(req.body, { abortEarly: false })
        // If validation is successful, proceed to the next middleware or route handler
        next()
        res.status(StatusCodes.CREATED).json({ mes: 'helo everyone Post', code : StatusCodes.CREATED })
    } catch (error) {
        console.log(error)
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ mes: new Error(error).message, code : StatusCodes.UNPROCESSABLE_ENTITY })

    }

}

export const boardValidation = {
    createNew
}