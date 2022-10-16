import { Request, Response, NextFunction } from 'express'
import { userManager } from '../../../db/managers'
import AsyncHandler from '../../../utils/AsyncHandler'

const getUsersFromGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const items = await userManager.getUsersFromGroup(req.params.group)
    const total = items.length

    res.json({ data: { items, total } })
  } catch (error) {
    next(error)
  }
}

export default AsyncHandler(getUsersFromGroup)
