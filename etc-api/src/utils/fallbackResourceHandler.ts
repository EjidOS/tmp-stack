import { NextFunction, Request, Response } from 'express'
import HttpError from './HttpError'

export default function fallbackResourceHandler(req: Request, res: Response, next: NextFunction): void {
  next(HttpError.methodNotAllowed())
}
