import * as express from 'express'

import usersService from './users-service'


export const initializeServices = (
  app: express.Application
): express.Application => {
   usersService(app)
  return app
}                                                         
