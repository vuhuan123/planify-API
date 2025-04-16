import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/boardValidation.js'
import { boardController } from '~/controllers/boardController.js'
const Router = express.Router()

Router.route('/')
.get(( req, res ) => {
    res.status(StatusCodes.OK).json({ mes: 'helo everyone Get', code : StatusCodes.OK })
})
.post(boardValidation.createNew, boardController.createNew)

Router.route('/:id')
.get(boardController.getDetails)
.put(boardValidation.update, boardController.update)
// API ho tro di chuyen card giua cac column khac nhau trong 1 board
Router.route('/supports/moving_card')
.put(boardValidation.moveCardToDifferentColumn, boardController.moveCardToDifferentColumn)

export const boardRoutes = Router