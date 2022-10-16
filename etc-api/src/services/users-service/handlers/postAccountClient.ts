import { Request, Response } from 'express'
import { matchedData } from 'express-validator'
import { userManager } from '../../../db/managers'
import { employeeManager } from '../../../db/managers'
import { awsCognitoManager } from '../../../db/managers'
import { roleManager } from '../../../db/managers'
import User from '../../../db/models/User'
import UserClientEmployee from '../../../db/models/UserClientEmployee'
import ClientRepresentative from '../../../db/models/ClientRepresentative'
import AsyncHandler from '../../../utils/AsyncHandler'
import HttpError from '../../../utils/HttpError'
import TransactionHandler from '../../../utils/TransactionHandler';

const postAccountClient = async (req: Request, res: Response): Promise<void> => {

  let userData = {}
  const tblUser = new User()
  const tblUserClientEmp = new UserClientEmployee()
  const tblClientRep = new ClientRepresentative()
  const result = []
  const resultClientRep = []
  const resultClientEmp = []
  const idAWS = req.body.selectedValueEnvironment
  const idSystem = req.body.selectedValueAplication
  const idRepresentative = req.body.selectedValueRepresentative
  const idEmployee = req.body.selectedValueEmployee
  //const idPosition = req.body.selectedValuePosition
  const idRole = req.body.selectedValueProfile
  const role = await roleManager.getRole(idRole)
  const awsParams = await awsCognitoManager.getAWSDKCognito(idAWS,idSystem)
  const representative = await employeeManager.getOneRepresentative(idRepresentative)

  // Keep eye On ...
  //"email":req.body.email, just to be sure
  //+52, just to be sure

  userData = {

        "email": req.body.email,
        "notes":req.body.notes,
        "representative":representative.email,
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "company": req.body.denomination,
        "role": role.name,
        "phone_number": req.body.phone_number,
        "city":"CDMX"
  }
  //"role": req.body.position,
  //"phone_number": "+52" + req.body.phone_number,

  try{

    // TBL Client                                                                          
    //const userData = matchedData(req)                                       
    const user = await userManager.createUser(userData, awsParams, 'CLT')
    const userByEmail = await userManager.getUserByEmail(userData.email)
                                                                              
    tblUser.idSystem = idSystem                                               
    tblUser.idAWSCognito = idAWS,                                             
    tblUser.idUserType = '2',                                                 
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

    // TBL UserClientEmployee
    tblUserClientEmp.idUser = result[0].id
    tblUserClientEmp.idClientEmployee = idEmployee
    await tblUserClientEmp.save()
    resultClientEmp.push(tblUserClientEmp) 

    // TBL ClientRepresentative
    tblClientRep.idUser = result[0].id
    tblClientRep.idEmployee = idRepresentative
    await tblClientRep.save()
    resultClientRep.push(tblClientRep)

    res.status(201).json({ data: user })

   }catch (error){
	throw HttpError.unprocessableEntity(error)
   }

}

export default AsyncHandler(TransactionHandler(postAccountClient))
