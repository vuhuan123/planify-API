/* eslint-disable no-console */
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { boardService } from '~/services/boardService'
const createNew = async (req, res, next) => {
    try {
        const createdBoard = await boardService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createdBoard)

    } catch (error) {
        // nếu có lỗi, middleware next(error) sẽ gửi lỗi đến middleware xử lý lỗi trong Express.
        next(error)
    }
}

export const boardController = {
    createNew
}