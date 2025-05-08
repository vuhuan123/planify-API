import { StatusCodes } from 'http-status-codes'
import { jwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'
import ApiError from '~/utils/ApiError'
// Middleware kiểm tra xem người dùng đã đăng nhập hay chưa
const isAuthorized = async (req, res, next) => {
    // Lấy accessToken từ request cookie của client
    const clientAccessToken = req.cookies?.accessToken
    // Nếu không có accessToken thì trả về lỗi
    if (!clientAccessToken) {
        return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! (token not found)'))
    }
    // Nếu có accessToken thì giải mã nó ra để lấy thông tin người dùng
    try {
        // Giải mã accessToken
        const accessTokenDecoded = await jwtProvider.verifyToken(clientAccessToken, env.ACCESS_TOKEN_SECRET)
        // console.log('accessTokenDecoded', accessTokenDecoded)
        // Nếu giải mã thành công thì gán thông tin người dùng vào
        req.jwtDecoded = accessTokenDecoded
        // cho phép request tiếp tục đi đến controller
        next()
    } catch (error) {
        // console.log('error', error)
        if (error?.message?.includes('jwt expired')) {
            // Nếu accessToken đã hết hạn thì trả về lỗi
            next(new ApiError(StatusCodes.GONE, 'Need to refresh token! (token expired)'))
            return
        }
        // Nếu accessToken không hợp lệ thì trả về lỗi
        next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized!'))
    }
}

export const authMiddleware = {
    isAuthorized
}