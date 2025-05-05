import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import {pickUser} from '~/utils/formatter'
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
        return pickUser(getUser) // trả về thông tin người dùng đã tạo, không bao gồm mật khẩu và các thông tin nhạy cảm khác
    }
    catch (error) {
        // throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
        console.error('Error in createNew function:', error)
    }
}

export const userService = {
    createNew
}