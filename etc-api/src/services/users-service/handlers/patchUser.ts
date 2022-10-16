import { Request, Response } from 'express'
import { matchedData } from 'express-validator'
import { userManager } from '../../../db/managers'
import AsyncHandler from '../../../utils/AsyncHandler'
import HttpError from '../../../utils/HttpError'
import TransactionHandler from '../../../utils/TransactionHandler';

const patchUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData = matchedData(req)
    const user = await userManager.updateUser(req.params.id, userData)
    res.status(201).json({ data: user })
  } catch (error) {
    throw HttpError.unprocessableEntity(error)
  }
}

export default AsyncHandler(TransactionHandler(patchUser))
