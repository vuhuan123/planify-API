import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatter'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { brevoProvider } from '~/providers/brevoProvider'
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

export const userService = {
    createNew
}