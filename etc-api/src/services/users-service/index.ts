import * as express from 'express'
import * as handlers from './handlers'
import auth from '../../utils/auth'
import validate from '../../utils/genericHandlerValidator'
import postUserValidator from './validators/postUserValidator'
import postAdminUserValidator from './validators/postAdminUserValidator'
import patchUserValidator from './validators/patchUserValidator'
import fallbackResourceHandler from '../../utils/fallbackResourceHandler'

export default function(app: express.Application) {
  const router = express.Router()

  router.get(
    '/group/:group',
    auth()
      .admin()
      .allow(),
    handlers.getUsersFromGroup
  )
  router.all('/group/:group', fallbackResourceHandler)

  /*router.post(
    '/admin',
    auth()
      .admin()
      .allow(),
    validate(postAdminUserValidator),
    handlers.postAdminUser
  )*/
  router.post('/admin', auth().admin().allow(), handlers.postAccountClient)
  router.all('/admin', fallbackResourceHandler)

  //router.get('/search', auth().private().admin().allow(), handlers.searchUsers)

  router.get(
    '/:id',
    auth()
      .admin()
      .allow(),
    handlers.getSpecificUser
  )

  /*router.patch(
    '/:id',
    auth()
      .admin()
      .allow(),
    validate(patchUserValidator),
    handlers.patchUser
  )

  router.all('/:id', fallbackResourceHandler)*/

  router.get(
    '/',
    auth()
      .admin()
      .allow(),
    handlers.getUsers
  )
  /*router.post(
    '/',
    auth()
      .admin()
      .allow(),
    validate(postUserValidator),
    handlers.postUser
  )*/

  router.post('/', auth().admin().allow(), handlers.postAccountEmployee) 
  router.all('/', fallbackResourceHandler)

  router.patch('/:id', auth().admin().allow(), handlers.patchUserStatus) 
  router.all('/:id', fallbackResourceHandler)

  app.use('/user', router)
}
