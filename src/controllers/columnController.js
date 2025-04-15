/* eslint-disable no-console */
import { StatusCodes } from 'http-status-codes'

import { columnService } from '~/services/columnService.js'
const createNew = async (req, res, next) => {
    try {
        const createdColumn = await columnService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createdColumn)

    } catch (error) {
        // nếu có lỗi, middleware next(error) sẽ gửi lỗi đến middleware xử lý lỗi trong Express.
        next(error)
    }
}


export const columnController = {
    createNew
}