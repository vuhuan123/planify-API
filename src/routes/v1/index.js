import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoutes } from './boardRoute'
import { columnRoute } from './columnRoute'
import { cardRoute } from './cardRoute'
import { userRoutes } from './userRoute'
import { invationRoute } from './invitationRoute'
const Router = express.Router()

Router.get('/status', (req, res) => {
    res.status(StatusCodes.OK).json({ status: 'OK men', code : StatusCodes.OK })
})
// board apis
Router.use('/boards', boardRoutes)
// columns apis
Router.use('/columns', columnRoute)
// cards apis
Router.use('/cards', cardRoute)
Router.use('/users', userRoutes)
Router.use('/invitations', invationRoute)
export const APIs_V1 = Router