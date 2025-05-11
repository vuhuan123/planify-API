import { StatusCodes } from 'http-status-codes'
import multer from 'multer'
import ApiError from '~/utils/ApiError'
import { ALLOW_COMMON_FILE_TYPES, LIMIT_COMMON_FILE_SIZE } from '~/utils/validators'
const customFileFilter = (req, file, cb) => {
    // console.log('file: ', file)
    // Doi vs multer, kiem tra file type thi su dung file.mimetype
    if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
    const errMess = 'File type is invalid. Only accept jpg, jpeg and png'
    return cb(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errMess), null)
  }
  // neu nhu kieu file hop le thi cb(null, true) de cho phep upload
  return cb(null, true)
}
 // Khoi tao func upload dc boc boi thang multer
 const upload = multer({
    limits: {
      fileSize: LIMIT_COMMON_FILE_SIZE // 10MB
    },
    fileFilter: customFileFilter
 })

export const multerUpload = { upload }