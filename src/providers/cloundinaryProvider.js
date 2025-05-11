import cloudinary from 'cloudinary'
import streamifier from 'streamifier'
import { env } from '~/config/environment'

// Cau hinh cloudinary
const cloudinaryV2 = cloudinary.v2
cloudinaryV2.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET
})

// Khoi tao func de tai len file len cloudinary
const uploadStream = (fileBuffer, folderName) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinaryV2.uploader.upload_stream( { folder: folderName }, (error, result) =>
            {
                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }
            }
        )
        streamifier.createReadStream(fileBuffer).pipe(stream)
    })
}
export const CloundinaryProvider = { uploadStream }