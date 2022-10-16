import { Request, Response, NextFunction } from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import HttpError from './HttpError'
import AsyncHandler from './AsyncHandler';

export default (userDataValidations: ValidationChain[], defaultValidations: ValidationChain[]) => {
  return AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      const validations =res.locals.isPrivateUser ? defaultValidations : [...defaultValidations, ...userDataValidations]
    await Promise.all(validations.map((validation) => validation.run(req)))

    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }

    throw HttpError.unprocessableEntity(
      errors
        .formatWith(({ msg }) => ({ error: msg }))
        .mapped())
  })
}