import { NextFunction, Request, Response } from 'express'

export default function AsyncHandler(target: (req: Request, res: Response, next?: NextFunction) => Promise<any>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await target(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
