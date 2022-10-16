import { Sequelize } from 'sequelize-typescript'

import * as cls from 'continuation-local-storage'

const namespace = cls.createNamespace('my-very-own-namespace')

const { RDS_HOSTNAME, RDS_DB_NAME, RDS_USERNAME, RDS_PASSWORD } = process.env;

(Sequelize as any).__proto__.useCLS(namespace)

/**
 * DB configuration
 *
 * https://github.com/RobinBuschmann/sequelize-typescript
 */
export const db = new Sequelize({
  database: RDS_DB_NAME,
  host: RDS_HOSTNAME,
  dialect: 'postgres',
  username: RDS_USERNAME,
  password: RDS_PASSWORD,
  modelPaths: [__dirname + '/models/*.ts'],
  modelMatch: (filename, member) => member.toLowerCase() !== 'index',
})
