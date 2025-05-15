import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { userModel } from '~/models/userModel'
import { boardModel } from '~/models/boardModel'
import { invitationModal } from '~/models/invitationModal'
import { INITATION_TYPES, BOARD_INVITATION_STATUS } from '~/utils/constants'
import { pickUser } from '~/utils/formatter'

const createNewBoardInvitation = async (reqBody, inviterId) => {
    try {
        const inviter = await userModel.findOneById(inviterId)
        const invitee = await userModel.findOneByEmail(reqBody.inviteeEmail)
        const board = await boardModel.findOneById(reqBody.boardId)
        if (!inviter || !invitee || !board) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Inviter, Invitee or Board not found')
        }
    const newInvitationData = {
        inviterId,
        inviteeId: invitee._id.toString(),
        type : INITATION_TYPES.BOARD_INVITATION,
        boardInvitation: {
            boardId : board._id.toString(),
            status : BOARD_INVITATION_STATUS.PENDING
        }
    }
    const createdInvitation = await invitationModal.createNewBoardInvitation(newInvitationData)
    const getInvitation = await invitationModal.findOneById(createdInvitation.insertedId.toString())
    const resInvitation = {
        ...getInvitation,
        board,
        inviteer: pickUser(inviter)
    }
    return resInvitation
}
catch (error) {
        throw new Error(error)
    }
}

export const invitationService = {
    createNewBoardInvitation
}