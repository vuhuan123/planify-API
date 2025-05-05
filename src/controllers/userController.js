/* eslint-disable no-console */
import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userSevices'
const createNew = async (req, res, next) => {
    try {
        const createdUser = await userService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createdUser)

    } catch (error) {
        // nếu có lỗi, middleware next(error) sẽ gửi lỗi đến middleware xử lý lỗi trong Express.
        next(error)
    }
}


export const userController = {
    createNew

}