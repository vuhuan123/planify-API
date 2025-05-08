/* eslint-disable no-console */
import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userSevices'
import ms from 'ms'
const createNew = async (req, res, next) => {
    try {
        const createdUser = await userService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createdUser)

    } catch (error) {
        // nếu có lỗi, middleware next(error) sẽ gửi lỗi đến middleware xử lý lỗi trong Express.
        next(error)
    }
}

const verifyAccount = async (req, res, next) => {
    try {
        const verifiedUser = await userService.verifyAccount(req.body)
        res.status(StatusCodes.OK).json(verifiedUser)

    } catch (error) {
        // nếu có lỗi, middleware next(error) sẽ gửi lỗi đến middleware xử lý lỗi trong Express.
        next(error)
    }
}

const login = async (req, res, next) => {
    try {
        const result = await userService.login(req.body)
        // xu ly http only cookie cho phia client
        res.cookie('accessToken', result.accessToken, {
            httpOnly : true,
            secure : true,
            sameSite : 'none',
            maxAge : ms('14 day')
        })

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly : true,
            secure : true,
            sameSite : 'none',
            maxAge : ms('14 day')
        })
        res.status(StatusCodes.OK).json(result)

    } catch (error) {
        // nếu có lỗi, middleware next(error) sẽ gửi lỗi đến middleware xử lý lỗi trong Express.
        next(error)
    }
}


export const userController = {
    createNew,
    verifyAccount,
    login

}