/* eslint-disable no-useless-catch */
// import { slugify } from '~/utils/formatter'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { CloundinaryProvider } from '~/providers/cloundinaryProvider'

const createNew = async (reqBody) => {
    try {
        const newCard = {
            ...reqBody
            // slug:slugify(reqBody.title)
        }
        const createdCard = await cardModel.createNew(newCard)
        // eslint-disable-next-line no-unused-vars
        const getNewCard = await cardModel.findOneById(createdCard.insertedId)
        if (getNewCard) {
            await columnModel.pushCardOrderIds(getNewCard)
        }
        return getNewCard
    } catch (error) {
        throw error
    }
}

const update = async (cardId, reqBody, cardCoverFile, userInfo) => {
    try {
        const updateData = {
            ...reqBody,
            updatedAt: Date.now()
        }
        let updatedCard = {}
        if (cardCoverFile) {
            const uploadResult = await CloundinaryProvider.uploadStream(cardCoverFile.buffer, 'card-covers')
            updatedCard = await cardModel.update(cardId, {
                cover: uploadResult.secure_url
            })
        } else if (updateData.commentToAdd) {
            //Tao du lieu comment de them vao db, can bo sung nhung fied can thiet
            const commentData = {
                ...updateData.commentToAdd,
                commentAt: Date.now(),
                userId : userInfo._id,
                userEmail : userInfo.email
            }
            updatedCard = await cardModel.unshiftNewComment(cardId, commentData)
        }
        else {
            // Cac truong hop chung
            updatedCard = await cardModel.update(cardId, updateData)
        }
        return updatedCard
    } catch (error) {
        throw error
    }
}

export const cardService = {
    createNew,
    update
}