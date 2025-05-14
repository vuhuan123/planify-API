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

const update = async (req, res, next) => {
     try {
        const cardId = req.params.id
        const cardCoverFile = req.file
        const updateCard = await cardService.update(cardId, req.body, cardCoverFile)
        res.status(StatusCodes.CREATED).json(updateCard)

    } catch (error) {
        // nếu có lỗi, middleware next(error) sẽ gửi lỗi đến middleware xử lý lỗi trong Express.
        next(error)
    }
}

export const cardController = {
    createNew,
    update
}