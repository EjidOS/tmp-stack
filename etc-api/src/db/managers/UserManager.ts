import { CognitoIdentityServiceProvider } from 'aws-sdk'

const {
  AWS_COGNITO_USER_SECRET,
  AWS_COGNITO_USER_ACCESS_KEY
} = process.env

interface UserResponse {
  username: string
  userCreateDate: Date
  userLastModifiedDate: Date
  enabled: boolean
  userStatus: string
  phone_number: string
  representative: string
  sub: string
  email: string
  name: string
  city: string
  firstName: string
  lastName: string
  company: string
  role: string
}

interface ConvertedAttributes {
  Name: string
  Value: string
}

export default class UserManager {
  private AWS_COGNITO_USERPOOLID: string = '-'
  private AWS_COGNITO_REGION: string = '-'
  private clientGroup: string = 'Clients'
  private adminGroup: string = 'Etc'
  //private adminGroup: string = 'Testing'
  private customFields: string[] = [
    'custom:firstName',
    'custom:lastName',
    'custom:company',
    'custom:representative',
    'custom:city',
    'custom:role',
    'custom:notes'
  ]
  private cognitoIdentityServiceProvider: CognitoIdentityServiceProvider = new CognitoIdentityServiceProvider()

  private processUser(user): UserResponse {
    const attrs = user.Attributes.reduce((storage, next) => {
      const key =
        next.Name.indexOf(':') > -1 ? next.Name.split(':')[1] : next.Name
      storage[key] = next.Value === 'NON' ? null : next.Value
      return storage
    }, {})

    return {
      username: user.Username,
      userCreateDate: user.UserCreateDate,
      userLastModifiedDate: user.UserLastModifiedDate,
      enabled: user.Enabled,
      userStatus: user.UserStatus,
      name: `${attrs.firstName || ''} ${attrs.lastName || ''}`,
      ...attrs
    }
  }

  private listify(userListResponse) {
    return userListResponse.Users.map(user => {
      return this.processUser(user)
    })
  }

  public findAttribute(paramName: string, attributes: ConvertedAttributes[]) {
    return attributes.find(attr => {
      return attr.Name === paramName
    })
  }

  private getUserName(attributes: ConvertedAttributes[]) {
    const process = (attr: string): string => {
      return this.findAttribute(attr, attributes)
        .Value.trim()
        .replace(/\s/g, '')
        .toLowerCase()
    }
    const first = process('custom:firstName')
    const last = process('custom:lastName')
    return [first, last].join('.')
  }

  public prepareUserData(userData): ConvertedAttributes[] {
    const setKey = key => {
      switch (key) {
        case 'phone_number':
          return 'phone_number'
        case 'email':
          return 'email'
        default:
          return `custom:${key}`
      }
    }

    return Object.keys(userData).map(key => {
      return {
        Name: setKey(key),
        Value: userData[key]
      }
    })
  }

  public async listUsers(filter?: string): Promise<UserResponse[]> {
    return new Promise((resolve, reject) => {
      this.cognitoIdentityServiceProvider.listUsers(
        {
          Filter: filter || null,
          UserPoolId: this.AWS_COGNITO_USERPOOLID,
          AttributesToGet: [
            'email',
            'sub',
            'phone_number',
            ...this.customFields
          ]
        },
        (err, data) => {
          if (err) {
            return reject(err)
          }

          return resolve(this.listify(data))
        }
      )
    })
  }

  private async postUser(attributes: ConvertedAttributes[], cb) {
    const config = {
      UserPoolId: this.AWS_COGNITO_USERPOOLID,
      Username: this.getUserName(attributes),
      DesiredDeliveryMediums: ['EMAIL'],
      UserAttributes: [
        ...attributes,
        {
          Name: 'email_verified',
          Value: 'true'
        },
        {
          Name: 'phone_number_verified',
          Value: 'true'
        }
      ]
    }
    this.cognitoIdentityServiceProvider.adminCreateUser(config, cb)
  }


  private async changeStatusUser(attributes){

    this.AWS_COGNITO_USERPOOLID = attributes.AWS_COGNITO_USERPOOLID
    this.AWS_COGNITO_REGION = attributes.AWS_COGNITO_REGION

    this.cognitoIdentityServiceProvider =  new CognitoIdentityServiceProvider({ 
		secretAccessKey: AWS_COGNITO_USER_SECRET, 
		accessKeyId: AWS_COGNITO_USER_ACCESS_KEY, 
		region: this.AWS_COGNITO_REGION 
    })

    return this.patchUserStatus(attributes)

  }

  private async patchUserStatus(attributes){
	
	return new Promise((resolve,reject) => {
		
		this.statusUser(attributes,(err,data)=>{

			if(err){
				return reject(err.message)				
			}
			return resolve(data)
		})
	})

  }

  private async statusUser(attributes, cb){

    const params = {

        UserPoolId: this.AWS_COGNITO_USERPOOLID,
	Username: attributes.aws_username
     }
     if(attributes.enable)
	this.cognitoIdentityServiceProvider.adminEnableUser(params, cb)
     else
	this.cognitoIdentityServiceProvider.adminDisableUser(params, cb)

  }

  private async addUserToGroup(username: string, group: string, cb) {
    const groupParams = {
      GroupName: group,
      UserPoolId: this.AWS_COGNITO_USERPOOLID,
      Username: username
    }
    this.cognitoIdentityServiceProvider.adminAddUserToGroup(groupParams, cb)
  }

  private async saveUser(attributes: ConvertedAttributes[], groupName: string) {
    return new Promise((resolve, reject) => {
      this.postUser(attributes, (err, data) => {
        if (err) {
          return reject(err.message)
        }
        const user = this.processUser(data.User)
        this.addUserToGroup(user.username, groupName, (err, result) => {
          if (err) {
            return reject(err.message)
          }
          return resolve(result)
        })
      })
    })
  }

  public setDefaultPropsOnUser(
    attributes: ConvertedAttributes[]
  ): ConvertedAttributes[] {
    this.customFields.forEach(field => {
      if (!this.findAttribute(field, attributes)) {
        attributes.push({
          Name: field,
          Value: 'NON' // need to set a default on custom attrs
        })
      }
    })

    return attributes
  }

  public async createUser(attributes,attrAWS, typeGroup): Promise<any> {    

    console.log("USERPOOLID:" + attrAWS.AWS_COGNITO_USERPOOLID + " COGNITO_REGION:" + attrAWS.AWS_COGNITO_REGION + " ACCESSKEY:" + AWS_COGNITO_USER_SECRET + " KEYID:" + AWS_COGNITO_USER_ACCESS_KEY)

    this.AWS_COGNITO_USERPOOLID = attrAWS.AWS_COGNITO_USERPOOLID
    this.AWS_COGNITO_REGION = attrAWS.AWS_COGNITO_REGION

    this.cognitoIdentityServiceProvider =  new CognitoIdentityServiceProvider({ 
		secretAccessKey: AWS_COGNITO_USER_SECRET, 
		accessKeyId: AWS_COGNITO_USER_ACCESS_KEY, 
		region: this.AWS_COGNITO_REGION 
    })

    //const group = attrAWS.system.name === 'USR' ? this.adminGroup : this.clientGroup
    const group = typeGroup === 'EMP' ? this.adminGroup : this.clientGroup

    const attrs = this.setDefaultPropsOnUser(this.prepareUserData(attributes))
    return this.saveUser(attrs, group)
  }

  public async createAdminUser(attributes): Promise<any> {
  // Despite createAdminUser has been not used, it working fine ...
    const attrs = this.setDefaultPropsOnUser(this.prepareUserData(attributes))
    return this.saveUser(attrs, this.adminGroup)
  }

  
  public async updateAccount(attributes, attrAWS): Promise<any>{

    const uuid = attrAWS.aws_uuid
    this.AWS_COGNITO_USERPOOLID = attrAWS.AWS_COGNITO_USERPOOLID
    this.AWS_COGNITO_REGION = attrAWS.AWS_COGNITO_REGION

    this.cognitoIdentityServiceProvider =  new CognitoIdentityServiceProvider({ 
		secretAccessKey: AWS_COGNITO_USER_SECRET, 
		accessKeyId: AWS_COGNITO_USER_ACCESS_KEY, 
		region: this.AWS_COGNITO_REGION 
    })

    //const attrs = this.setDefaultPropsOnUser(this.prepareUserData(attributes))
    return this.updateUser(uuid, attributes)
  }

  private async updateUser(uuid: string, attributes): Promise<any> {

    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.getUserByUUID(uuid)
        const params = {
          UserAttributes: this.prepareUserData(attributes),
          UserPoolId: this.AWS_COGNITO_USERPOOLID,
          Username: user.username
        }
        this.cognitoIdentityServiceProvider.adminUpdateUserAttributes(
          params,
          (err, result) => {
            if (err) {
              return reject(err.message)
            }
            return resolve(result)
          }
        )
      } catch (error) {
        reject(error)
      }
    })
  }

  public async getUserByEmail(email: string): Promise<UserResponse> {
    return new Promise(async (resolve, reject) => {
      try {
        const [user] = await this.listUsers(`email = \"${email}\"`)
        resolve(user)
      } catch (error) {
        reject('No matching user')
      }
    })
  }

  public async getUserByPhoneNumber(phoneNumber: string): Promise<UserResponse> {
    return new Promise(async (resolve, reject) => {
      try {
        const [user] = await this.listUsers(`phone_number = \"${phoneNumber}\"`)
        resolve(user)
      } catch (error) {
        reject('No matching user')
      }
    })
  }

  public async getUserByUUID(uuid: string): Promise<UserResponse> {
    console.log("getUserByUUID:" + uuid)
    return new Promise(async (resolve, reject) => {
      try {
        const [user] = await this.listUsers(`sub = \"${uuid}\"`)
        resolve(user)
      } catch (error) {
        reject('No matching user')
      }
    })
  }

  public async getUsersFromGroup(
    groupName: string
  ): Promise<ConvertedAttributes[]> {
    return new Promise((resolve, reject) => {
      const params = {
        GroupName: groupName,
        UserPoolId: this.AWS_COGNITO_USERPOOLID,
        Limit: 60
      }
      this.cognitoIdentityServiceProvider.listUsersInGroup(
        params,
        (err, data) => {
          if (err) {
            return reject(err.message)
          }
          return resolve(this.listify(data))
        }
      )
    })
  }

  public async getClientContacts(registeredClients: string[]): Promise<any[]> {
    const omitExcessClientAttr = ({ name, role, company, email }) => ({
      name,
      role,
      company,
      email
    })
    const getUserByEmail = (email: string) =>
      this.getUserByEmail(email)
        .then(omitExcessClientAttr)
        .catch(() => ({ email }))

    return Promise.all(registeredClients.map(getUserByEmail))
  }
}
