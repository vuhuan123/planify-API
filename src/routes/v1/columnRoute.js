import express from 'express'
import { columnValidation } from '~/validations/columnValidation.js'
import { columnController } from '~/controllers/columnController.js'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
.post(authMiddleware.isAuthorized, columnValidation.createNew, columnController.createNew)
Router.route('/:id')
.put(authMiddleware.isAuthorized, columnValidation.update, columnController.update)
.delete(authMiddleware.isAuthorized, columnValidation.deleteColumn, columnController.deleteColumn)
export const columnRoute = Router