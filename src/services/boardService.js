/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatter'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
const createNew = async (reqBody) => {
    try {
        const newBoard = {
            ...reqBody,
            slug:slugify(reqBody.title)
        }
        const createdBoard = await boardModel.createNew(newBoard)
        // eslint-disable-next-line no-unused-vars
        // const idBoard = await boardModel.findOneById(createdBoard.insertedId)
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
        //B1 clone board
        const resBoard = cloneDeep(board)
        // b2: Dua card ve dung column cua no
        resBoard.columns.map((column) => {
            // column.cards = resBoard.cards.filter((card) => card.columnId.equals(column._id))
            column.cards = resBoard.cards.filter((card) => card.columnId.toString() === column._id.toString())
        })
        // xoa card ra khoi mang ban dau
        delete resBoard.cards
        return resBoard
    } catch (error) {
        throw error
    }
}

const update = async (boardId, reqBody) => {
    try {
        const updateData = {
            ...reqBody,
            updatedAt: Date.now()
        }
        const updatedBoard = await boardModel.update(boardId, updateData)
        return updatedBoard
    } catch (error) {
        throw error
    }
}

const moveCardToDifferentColumn = async (reqBody) => {
    try {
        //b1 Cap nhat mang cardOrderIds cau column ban dau chua no
        await columnModel.update(reqBody.prevColumnId, {
            cardOrderIds: reqBody.prevCardOrderIds,
            updatedAt: Date.now()
        })

        //b2 cap nhat mang cardOrderIds cau Column tiep theo
        await columnModel.update(reqBody.nextColumnId, {
            cardOrderIds: reqBody.nextCardOrderIds,
            updatedAt: Date.now()
        })
        //b3 Cap nh lai truong columnId moi cua cai Card da keo

        await cardModel.update(reqBody.currentCardId, {
            columnId: reqBody.nextColumnId,
            updatedAt: Date.now()
        })
        return { updateResult:'Succesfully' }
    } catch (error) {
        throw error
    }
}


export const boardService = {
    createNew,
    getDetails,
    update,
    moveCardToDifferentColumn
}