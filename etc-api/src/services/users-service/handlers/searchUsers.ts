import { Request, Response, NextFunction } from 'express'
import { userManager } from '../../../db/managers'
import AsyncHandler from '../../../utils/AsyncHandler'

const searchUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.query.email) {
      return next('Missing required query string arguments')
    }

    const {
      email,
      role,
      firstName,
      lastName,
      name,
      company,
      phone_number
    } = await userManager.getUserByEmail(req.query.email)
    res.json({
      data: { email, role, firstName, lastName, name, company, phone_number }
    })
  } catch (error) {
    next(error)
  }
}

export default AsyncHandler(searchUsers)
