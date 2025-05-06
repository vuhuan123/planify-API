import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatter'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { brevoProvider } from '~/providers/brevoProvider'
import { env } from '~/config/environment'
import { jwtProvider } from '~/providers/JwtProvider'
const createNew = async (reqBody) => {
    try {
     // kiem tra xem email da ton tai hay chua
        const user = await userModel.findOneByEmail(reqBody.email)
        if (user) {
            throw new ApiError(StatusCodes.CONFLICT, 'Email already exists')
        }

        // create new user
        const nameFromEmail = reqBody.email.split('@')[0]
        const data = {
            email: reqBody.email,
            password: bcrypt.hashSync(reqBody.password, 10), // mã hóa mật khẩu, doi so thu 2 la do phuc tap
            username: nameFromEmail,
            displayName: nameFromEmail,
            verifyToken: uuidv4() // tạo mã xác thực ngẫu nhiên
        }
        const createdUser = await userModel.createNew(data)
        const getUser = await userModel.findOneById(createdUser.insertedId)
        // email
        const vericationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getUser.email}&token=${getUser.verifyToken}` // tạo đường dẫn xác thực
        const customSubject = 'Xác thực tài khoản Planyfi'
        const htmlText = `
            <h2>Chào mừng bạn đến với Planyfi</h2>
            <p>Vui lòng nhấp vào liên kết bên dưới để xác thực tài khoản của bạn:</p>
            <a href="${vericationLink}">Xác thực tài khoản</a>
            <p>Nếu bạn không yêu cầu xác thực tài khoản, vui lòng bỏ qua email này.</p>
        ` // goi toi provider gui mail de gui mail xac thuc
        await brevoProvider.sendEmail(getUser.email, customSubject, htmlText) // gui mail xac thuc
        return pickUser(getUser) // trả về thông tin người dùng đã tạo, không bao gồm mật khẩu và các thông tin nhạy cảm khác
    }
    catch (error) {
        // throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
        throw Error(error)
    }
}
const verifyAccount = async (reqBody) => {
    try {
      // kiem tra xem email da ton tai hay chua
        const user = await userModel.findOneByEmail(reqBody.email)
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
        }
        // kiem tra xem token co dung hay khong
        if (user.isActive) {
            throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account has been activated')
        }
        if (user.verifyToken !== reqBody.token) {
            throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Token is not valid')
        }
        // neu nhu token dung thi cap nhat lai trang thai tai khoan
        const updateData = {
            isActive: true,
            verifyToken: null // xoa token sau khi xac thuc
        }
        const updatedUser = await userModel.updateById(user._id, updateData)
        return pickUser(updatedUser) // trả về thông tin người dùng đã xác thực, không bao gồm mật khẩu và các thông tin nhạy cảm khác
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
}

const login = async (reqBody) => {
    const user = await userModel.findOneByEmail(reqBody.email)

    try {
      // kiem tra xem email da ton tai hay chua
      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }
    // kiem tra xem token co dung hay khong
    if (!user.isActive) {
        throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active')
    }
    if (!bcrypt.compareSync(reqBody.password, user.password)) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Password is not valid')
    }
    // neu moi thu ok thi bat dau tao token de tra ve cho client
// tạo token cho người dùng
    const userInfor = { _id: user._id, email: user.email }
    const accessToken = await jwtProvider.generateToken(userInfor, env.ACCESS_TOKEN_SECRET, env.ACCESS_TOKEN_LIFE)
    const refreshToken = await jwtProvider.generateToken(userInfor, env.REFRESH_TOKEN_SECRET, env.REFRESH_TOKEN_LIFE)
    return { accessToken, refreshToken, ...pickUser(user) } // trả về thông tin người dùng đã xác thực, không bao gồm mật khẩu và các thông tin nhạy cảm khác
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
}
export const userService = {
    createNew,
    verifyAccount,
    login
}