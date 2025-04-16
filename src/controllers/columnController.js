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

// hàm update được sử dụng để cập nhật thông tin của một cột (column) trong ứng dụng quản lý công việc.
const update = async (req, res, next) => {
    try {
        const columnId = req.params.id
        const updatedColumn = await columnService.update(columnId, req.body)
        res.status(StatusCodes.OK).json(updatedColumn)
    } catch (error) {

        next(error)
    }
}


export const columnController = {
    createNew,
    update
}