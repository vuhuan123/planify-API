/* eslint-disable no-console */
import { StatusCodes } from 'http-status-codes'

import { boardService } from '~/services/boardService'
const createNew = async (req, res, next) => {
    try {
        const userId = req.jwtDecoded._id
        const createdBoard = await boardService.createNew(userId, req.body)
        res.status(StatusCodes.CREATED).json(createdBoard)

    } catch (error) {
        // nếu có lỗi, middleware next(error) sẽ gửi lỗi đến middleware xử lý lỗi trong Express.
        next(error)
    }
}

const getDetails = async (req, res, next) => {
    try {
        const userId = req.jwtDecoded._id
        const boardId = req.params.id
        const board = await boardService.getDetails(userId, boardId)
        res.status(StatusCodes.OK).json(board)
    } catch (error) {

        next(error)
    }
}

const update = async (req, res, next) => {
    try {
        const boardId = req.params.id
        const updatedBoard = await boardService.update(boardId, req.body)
        res.status(StatusCodes.OK).json(updatedBoard)
    } catch (error) {

        next(error)
    }
}
const moveCardToDifferentColumn = async (req, res, next) => {
    try {
        const result = await boardService.moveCardToDifferentColumn(req.body)
        res.status(StatusCodes.OK).json(result)
    } catch (error) {

        next(error)
    }
}

const getBoards = async (req, res, next) => {
    try {
        const userId = req.jwtDecoded._id
        const { page, itemsPerPage } = req.query
        const result = await boardService.getBoards(userId, page, itemsPerPage)
        res.status(StatusCodes.OK).json(result)
    } catch (error) {
        next(error)
    }
}

export const boardController = {
    createNew,
    getDetails,
    update,
    moveCardToDifferentColumn,
    getBoards
}