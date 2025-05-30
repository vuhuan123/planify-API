import { StatusCodes } from 'http-status-codes'
import { invitationService } from '~/services/invitationService'
const createNewBoardInvitation = async (req, res, next) => {
    try {
        const inviterId = req.jwtDecoded._id
        const resInvite = await invitationService.createNewBoardInvitation(req.body, inviterId)
        res.status(StatusCodes.CREATED).json(resInvite)
} catch (error) {
        next(error)
    }
}

const getInvitation = async (req, res, next) => {
    try {
        const userId = req.jwtDecoded._id
        const resInvitation = await invitationService.getInvitation(userId)
        res.status(StatusCodes.OK).json(resInvitation)
    } catch (error) {
        next(error)
    }
}

const updateBoardInvitation = async ( req, res, next) =>{
    try {
        const userId = req.jwtDecoded._id
        const { invitationId } = req.params
        const { status } = req.body
        const updatedInvitation = await invitationService.updateBoardInvitation(userId, invitationId, status)
        res.status(StatusCodes.OK).json(updatedInvitation)
    } catch (error) {
       next(error)
    }
}
export const invitationController = {
    createNewBoardInvitation,
    getInvitation,
    updateBoardInvitation
}