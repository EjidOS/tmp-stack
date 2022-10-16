import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import * as express from 'express'
import HttpError from './utils/HttpError'

export const initialize = (app: express.Application) => {
  // not existed resource requested
  app.use((req: Request, res: Response, next: NextFunction) => {
    next(HttpError.notImplemented())
  })

  // global error handler
  app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      return next(error)
    }

    const now = new Date()

    if (!(error instanceof HttpError)) {
      console.error(`Internal error`)
      console.error(error)
      error = HttpError.internalServerError()
    }

    console.error(`[${now.toISOString()}] HTTP Error "${req.method} ${req.url}" (${JSON.stringify(req.query)})`)
    console.error('Authenticated User: ', res.locals.user)
    console.error(error)

    const json = {
      error: error.error,
      message: error.message,
    }

    res.status(error.status).json(json)
  })
}
