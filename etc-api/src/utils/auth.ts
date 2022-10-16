import { Request, Response, NextFunction } from 'express'
import HttpError from './HttpError'
import AsyncHandler from './AsyncHandler'

class Auth {
  private publicUser = false
  private privateUser = false
  private adminUser = false
  public admin() {
    this.adminUser = true
    return this
  }
  public public() {
    this.publicUser = true
    return this
  }
  public private() {
    this.privateUser = true
    return this
  }
  public allow() {
    return AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      if ((this.publicUser && res.locals.isPublicUser)
      || (this.privateUser && res.locals.isPrivateUser)
      || (this.adminUser && res.locals.isAdminUser)) {
        return next()
      }

      throw HttpError.forbidden()
    })
  }
  public deny() {
    return AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      if ((this.publicUser && res.locals.isPublicUser)
      || (this.privateUser && res.locals.isPrivateUser)
      || (this.adminUser && res.locals.isAdminUser)) {
        throw HttpError.forbidden()
      }

      return next()
    })
  }
}

export default () => new Auth()
