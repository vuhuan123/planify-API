/* eslint-disable no-console */
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'


const createNewBoardInvitation = async (req, res, next) => {
    const schema = Joi.object({
        inviteeEmail: Joi.string().required(),
        boardId: Joi.string().required()
    })
    try {
        await schema.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        next( new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message) )
    }

}

export const invitationValidation = {
    createNewBoardInvitation
}
