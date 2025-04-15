import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { columnValidation } from '~/validations/columnValidation.js'
import { columnController } from '~/controllers/columnCOntroller.js'
const Router = express.Router()

Router.route('/')
.post(columnValidation.createNew, columnController.createNew)


export const columnRoute = Router