import { Request, Response, NextFunction } from 'express'
import { db } from '../db/index'

export default function TransactionHandler(target: (req: Request, res: Response, next?: NextFunction) => Promise<any>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    await db.transaction(target.bind(null, req, res, next))
  }
}
