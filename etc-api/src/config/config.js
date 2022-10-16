require("dotenv").config()

const { RDS_HOSTNAME, RDS_DB_NAME, RDS_USERNAME, RDS_PASSWORD } = process.env

module.exports = {
  development: {
    username: RDS_USERNAME,
    password: RDS_PASSWORD,
    database: RDS_DB_NAME,
    host: RDS_HOSTNAME,
    dialect: "postgres",
  },
}
