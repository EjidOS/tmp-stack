import * as express from 'express'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import * as sanitize from 'sanitize'
import * as fileUpload from 'express-fileupload'
import * as CognitoExpress from 'cognito-express'
import HttpError from './utils/HttpError';

const { AWS_COGNITO_USERPOOLID, AWS_COGNITO_REGION } = process.env

export const initialize = (app: express.Application) => {
  /**
   * cors - consider using a white-list
   * this way, we support requests made from our site only.
   */


  app.use(cors())
  app.use(sanitize.middleware)
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(fileUpload())

  const cognitoExpress = new CognitoExpress({
    region: AWS_COGNITO_REGION,
    cognitoUserPoolId: AWS_COGNITO_USERPOOLID,
    tokenUse: 'id'
  })

  app.use(
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      res.locals.user = null
      res.locals.isPublicUser = true
      res.locals.isPrivateUser = false
      res.locals.isAdminUser = false

    const accessTokenFromClient = req.headers.authorization

      if (!accessTokenFromClient) {
        return next()
      }

      cognitoExpress.validate(
        accessTokenFromClient.slice(8), // "Bearer: "
        (err, response) => {
          if (err) {
            return next(HttpError.unauthorized(err))
          }
          // Else API has been authenticated. Proceed.
          res.locals.user = response
          res.locals.isPublicUser = false
          if (
            response['cognito:groups'] &&
            response['cognito:groups'].indexOf('Etc') !== -1
            //response['cognito:groups'].indexOf('Testing') !== -1
          ) {
            res.locals.isAdminUser = true
          } else {
            res.locals.isPrivateUser = true
          }
          next()
        }
      )
    }
  )
}
