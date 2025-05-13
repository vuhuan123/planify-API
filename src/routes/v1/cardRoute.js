import express from 'express'
import { authMiddleware } from '~/middlewares/authMiddleware'

import { cardValidation } from '~/validations/cardValidation.js'
import { cardController } from '~/controllers/cardController.js'
const Router = express.Router()

Router.route('/')
.post(authMiddleware.isAuthorized, cardValidation.createNew, cardController.createNew)
Router.route('/:id')
.put(authMiddleware.isAuthorized, cardValidation.update, cardController.update)

export const cardRoute = Router