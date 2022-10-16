import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  HasMany,
  HasOne,
  BelongsTo,
  ForeignKey,
  Default,
  AutoIncrement,
  AllowNull
} from 'sequelize-typescript'

/*import System from './System'
import Role from './Role'*/
/*import AWSCognito from './AWSCognito'
import ClientRepresentative from './ClientRepresentative'*/

@Table({ timestamps: false, paranoid: true, schema: 'Admin', tableName: 'Users'})
export default class User extends Model<User> {
  
  /*@AllowNull(false)
  @Column
  public idUser: number*/

/*@Column
  public idSystem: number */

  @AutoIncrement
  @AllowNull(false) 
  @Column({primaryKey:true, field: 'idUser'})
  public id: number

 /* @ForeignKey(() => System)
  @Column
  public idSystem: number

  @BelongsTo(() => System)
  system: System

  @ForeignKey(() => AWSCognito)
  @Column
  public idAWSCognito: number

  @BelongsTo(() => AWSCognito)
  cognito: AWSCognito

  @Column
  public idUserType: number

  @ForeignKey(() => Role)
  @Column
  public idRole: number

  @BelongsTo(() => Role)
  profiles: Role

  @Column
  public aws_uuid: string

  @Column
  public aws_accountStatus: string

  @Column
  public aws_emailVerified: string

  @Column
  public aws_phoneNumberVerified: string
 
  @Column
  public aws_userName: string

  @Column
  public aws_email: string

  @Column
  public aws_notes: string

  @Column
  public aws_phoneNumber: string

  @Column
  public enabled: boolean*/

/*  @Column
  public updatedAt: string

  @Column
  public createdAt: string*/

  //@HasOne(() => ClientRepresentative)
  //representative: ClientRepresentative

}
