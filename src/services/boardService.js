/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatter'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
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

const getDetails = async (boardId) => {
    try {
        const board = await boardModel.getDetails(boardId)
        if (!board) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
        }
        return board
    } catch (error) {
        throw error
    }
}

export const boardService = {
    createNew,
    getDetails
}