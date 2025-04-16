/* eslint-disable no-useless-catch */
// import { slugify } from '~/utils/formatter'
import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'

const createNew = async (reqBody) => {
    try {
        const newColumn = {
            ...reqBody
        }
        const createdColumn = await columnModel.createNew(newColumn)
        // eslint-disable-next-line no-unused-vars
        const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)
        if (getNewColumn) {
            getNewColumn.cards = [] // add cards to column
            await boardModel.pushColumnOrderIds(getNewColumn)
        }
        return getNewColumn
    } catch (error) {
        throw error
    }
}
const update = async (columnId, reqBody) => {
    try {
        const updateData = {
            ...reqBody,
            updatedAt: Date.now()
        }
        const updatedColumn = await columnModel.update(columnId, updateData)
        return updatedColumn
    } catch (error) {
        throw error
    }
}

export const columnService = {
    createNew,
    update
}