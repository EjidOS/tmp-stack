import { Request, Response, NextFunction } from 'express'
import { userManager } from '../../../db/managers'
import AsyncHandler from '../../../utils/AsyncHandler'

const getSpecificUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
      const user = await userManager.getUserByUUID(req.params.id)
      res.json({ data: user })
    } catch (error) {
        next(error)
    }
}

export default AsyncHandler(getSpecificUser)