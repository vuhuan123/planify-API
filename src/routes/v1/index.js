import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoutes } from './boardRoutes'
const Router = express.Router()

Router.get('/', (req, res) => {
    res.send('<p>Birds home page<p>')
  })
Router.get('/status', (req, res) => {
    res.status(StatusCodes.OK).json({ status: 'OK men', code : StatusCodes.OK })
})
Router.use('/board', boardRoutes)

export const APIs_V1 = Router