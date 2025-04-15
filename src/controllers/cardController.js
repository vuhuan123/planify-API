/* eslint-disable no-console */
import { StatusCodes } from 'http-status-codes'

import { cardService } from '~/services/cardService'
const createNew = async (req, res, next) => {
    try {
        const createdCard = await cardService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createdCard)

    } catch (error) {
        // nếu có lỗi, middleware next(error) sẽ gửi lỗi đến middleware xử lý lỗi trong Express.
        next(error)
    }
}

export const cardController = {
    createNew
}