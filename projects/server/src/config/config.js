require("dotenv").config();

const {
  USER_DB,
  PASS_DB,
  SOURCE_DB,
  USER_DB_POD,
  PASSWORD_DB_POD,
  SOURCE_DB_POD,
  HOST_POD,
} = process.env;

module.exports = {
  development: {
    username: USER_DB_POD,
    password: PASSWORD_DB_POD,
    database: SOURCE_DB_POD,
    host: HOST_POD,
    // host: "127.0.0.1",
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: USER_DB_POD,
    password: PASSWORD_DB_POD,
    database: SOURCE_DB_POD,
    host: HOST_POD,
    dialect: "mysql",
  },
};
