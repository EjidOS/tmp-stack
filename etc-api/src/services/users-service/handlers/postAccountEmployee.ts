import { Request, Response } from 'express'
import { matchedData } from 'express-validator'
import { userManager } from '../../../db/managers'
import { awsCognitoManager } from '../../../db/managers'
import { employeeManager } from '../../../db/managers'
import { roleManager } from '../../../db/managers' 
import User from '../../../db/models/User'
import UserEmployee from '../../../db/models/UserEmployee'
import AsyncHandler from '../../../utils/AsyncHandler'
import HttpError from '../../../utils/HttpError'
import TransactionHandler from '../../../utils/TransactionHandler';

const postAccountEmployee = async (req: Request, res: Response): Promise<void> => {

   let userData = {}
   const tblUser = new User()
   const tblUserEmp = new UserEmployee()
   const result = []
   const resultEmp = []
   const idAWS = req.body.selectedValueEnvironment
   const idSystem = req.body.selectedValueAplication
   const idEmployee = req.body.selectedValueEmployee
   const idRole = req.body.selectedValueProfile
   const awsParams = await awsCognitoManager.getAWSDKCognito(idAWS, idSystem)
   const employeeData = await employeeManager.getPositionEmployee(idEmployee)
   const role = await roleManager.getRole(idRole)
   //const idRole = employeeData.positions.id

   // Keep eye On ...
   //"email":req.body.email, just to be sure
   //+52, just to be sure
   
   userData = {
	"email": req.body.email,
	"notes":req.body.notes,
	"representative":"who@etc.com.mx",
	"firstName": employeeData.firstName,
	"lastName": employeeData.lastName,
	"company": employeeData.companies.name,
	"role": role.name,
	"phone_number": "+52" + req.body.phone_number,
	"city":"CDMX"
  }
	//"role": employeeData.positions.name,

  try{

    //const userData = matchedData(req)
    const user = await userManager.createUser(userData, awsParams, 'EMP')
    const userByEmail = await userManager.getUserByEmail(userData.email)

    tblUser.idSystem = idSystem
    tblUser.idAWSCognito = idAWS,
    tblUser.idUserType = '1',
    tblUser.idRole = idRole,
    tblUser.aws_uuid = userByEmail.sub,
    tblUser.aws_accountStatus = userByEmail.userStatus,
    // Values verified email and phone are hardcoded on cognito too.
    tblUser.aws_emailVerified = 'true',
    tblUser.aws_phoneNumberVerified = 'true',
    //tblUser.aws_emailVerified = userByEmail.email_verified,
    //tblUser.aws_phoneNumberVerified = userByEmail.phone_number_verified,
    tblUser.aws_userName = userByEmail.username
    tblUser.aws_email = userByEmail.email,
    tblUser.aws_notes = userByEmail.notes,
    tblUser.aws_phoneNumber = userByEmail.phone_number,
    tblUser.enabled = 't'
   
    await tblUser.save()
    result.push(tblUser)

    tblUserEmp.idUser = result[0].id
    tblUserEmp.idEmployee = idEmployee
    
    await tblUserEmp.save()
    resultEmp.push(tblUserEmp)

    res.status(201).json({ data: user })

  }catch (error){
   throw HttpError.unprocessableEntity(error)
  }
}

export default AsyncHandler(TransactionHandler(postAccountEmployee))
