import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'
import { authMiddleware } from '~/middlewares/authMiddleware'
const Router = express.Router()

Router.route('/')
.get(authMiddleware.isAuthorized, (req, res ) => {
    res.status(StatusCodes.OK).json({ mes: 'helo everyone Get', code : StatusCodes.OK })
})
.post(authMiddleware.isAuthorized, boardValidation.createNew, boardController.createNew)

Router.route('/:id')
.get(authMiddleware.isAuthorized, boardController.getDetails)
.put(authMiddleware.isAuthorized, boardValidation.update, boardController.update)
// API ho tro di chuyen card giua cac column khac nhau trong 1 board
Router.route('/supports/moving_card')
.put(authMiddleware.isAuthorized, boardValidation.moveCardToDifferentColumn, boardController.moveCardToDifferentColumn)

export const boardRoutes = Router