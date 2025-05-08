/* eslint-disable no-console */
import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userSevices'
import ms from 'ms'
import ApiError from '~/utils/ApiError'
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

const logout = async (req, res, next) => {
    try {
        // xoa cookie tren client
        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')
        res.status(StatusCodes.OK).json({ loggedOut : true })

    } catch (error) {
        // nếu có lỗi, middleware next(error) sẽ gửi lỗi đến middleware xử lý lỗi trong Express.
        next(error)
    }

}

const refreshToken = async (req, res, next) => {
    try {
        const result = await userService.refreshToken(req.cookies?.refreshToken)
        res.cookie('accessToken', result.accessToken, {
            httpOnly : true,
            secure : true,
            sameSite : 'none',
            maxAge : ms('14 day')
        })
        res.status(StatusCodes.OK).json(result)

    } catch (error) {
        // nếu có lỗi, middleware next(error) sẽ gửi lỗi đến middleware xử lý lỗi trong Express.
        next(new ApiError(StatusCodes.FORBIDDEN, 'Please sign in (Invalid refresh token)'))
    }
}


export const userController = {
    createNew,
    verifyAccount,
    login,
    logout,
    refreshToken

}