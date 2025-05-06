import JWT from 'jsonwebtoken'


// func tao 1 token co 3 tham so: userInfo, privateKey, tokenLife
// userInfo: thong tin nguoi dung, privateKey: khoa bi mat, tokenLife: thoi gian ton tai cua token
const generateToken = async (userInfo, privateKey, tokenLife) => {
    try {
        return JWT.sign(userInfo, privateKey, {
            algorithm: 'HS256',
            expiresIn: tokenLife
        })
    } catch (error) {
        throw new Error(error)
    }
}

const verifyToken = async (token, privateKey) => {
    try {
        return JWT.verify(token, privateKey)
    } catch (error) {
        throw new Error(error)
    }
}

export const jwtProvider = {
    generateToken,
    verifyToken
}