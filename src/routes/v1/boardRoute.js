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


export const boardRoutes = Router