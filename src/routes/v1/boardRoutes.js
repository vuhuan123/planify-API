import express from 'express'
import { StatusCodes } from 'http-status-codes'

const Router = express.Router()

Router.route('/')
.get(( req, res ) => {
    res.status(StatusCodes.OK).json({ mes: 'helo everyone Get', code : StatusCodes.OK })
})
.post(( req, res ) => {
    res.status(StatusCodes.CREATED).json({ mes: 'helo everyone Post', code : StatusCodes.CREATED })
})


export const boardRoutes = Router