import { Request, Response } from 'express'
import { matchedData } from 'express-validator'
import { userManager } from '../../../db/managers'
import { userEmployeeManager } from '../../../db/managers'
import { userClientEmployeeManager } from '../../../db/managers'
import User from '../../../db/models/User'
import AsyncHandler from '../../../utils/AsyncHandler'
import HttpError from '../../../utils/HttpError'
import TransactionHandler from '../../../utils/TransactionHandler';

const patchUserStatus = async (req: Request, res: Response): Promise<void> => {

   try{
	 //Remember check matchedData with variable userData
	 const idUserEmp = req.params.id
	 const userStatus = req.body.enable
	 const items = req.body.accountType === "employee" ? await userEmployeeManager.getOneUsersEmployees(idUserEmp) : await userClientEmployeeManager.getOneClientEmployee(idUserEmp)
	 const idUser = items.idUser
         
	 let attr: {[key: string]: any}
	 attr = {}
   
 	 attr['idUserEmployee']=idUserEmp
 	 attr['idUser']=idUser
	 attr['enable']=req.body.enable
	 attr['aws_username']=items.user.aws_userName
	 attr['AWS_COGNITO_USERPOOLID']=items.user.cognito.AWS_COGNITO_USERPOOLID
	 attr['AWS_COGNITO_REGION']=items.user.cognito.AWS_COGNITO_REGION
	 const user = await userManager.changeStatusUser(attr)
	 //not you ---- const updateUser = await userEmployeeManager.updateUserStatus(idUser,userStatus)

         const tblUser = await User.findByPk(idUser)
         tblUser.enabled = userStatus
  	 tblUser.set(tblUser)
         await tblUser.save()
         await tblUser.reload()

	 res.status(201).json({ data: user })
    }catch(error){
	throw HttpError.unprocessableEntity(error)
    }
}

export default AsyncHandler(TransactionHandler(patchUserStatus))
