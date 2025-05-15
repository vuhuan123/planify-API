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
export const invitationController = {
    createNewBoardInvitation
}