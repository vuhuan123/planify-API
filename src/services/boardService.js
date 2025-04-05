/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatter'
import { boardModel } from '~/models/boardModel'
const createNew = async (reqBody) => {
    try {
        const newBoard = {
            ...reqBody,
            slug:slugify(reqBody.title)
        }
        const createdBoard = await boardModel.createNew(newBoard)
        // eslint-disable-next-line no-unused-vars
        const idBoard = await boardModel.findOneById(createdBoard.insertedId)
        return createdBoard
    } catch (error) {
        throw error
    }
}

export const boardService = {
    createNew
}