/* eslint-disable no-console */
import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {
    try {
        console.log('request.body', req.body)
        res.status(StatusCodes.CREATED).json({ mes: 'helo everyone Post from controller', code : StatusCodes.CREATED })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            mes: 'hihi',
            code : StatusCodes.INTERNAL_SERVER_ERROR
        })

    }
}

export const boardController = {
    createNew
}