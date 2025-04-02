/* eslint-disable no-console */
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
const createNew = async (req, res, next) => {
    try {
        // console.log('request.body', req.body)
        // res.status(StatusCodes.CREATED).json({ mes: 'helo everyone Post from controller', code : StatusCodes.CREATED })
        throw new ApiError(StatusCodes.BAD_REQUEST, 'This is a custom error message')
    } catch (error) {
        // nếu có lỗi, middleware next(error) sẽ gửi lỗi đến middleware xử lý lỗi trong Express.
        next(error)
    }
}

export const boardController = {
    createNew
}