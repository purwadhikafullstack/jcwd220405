require("dotenv").config();

const { USER_DB, PASS_DB, SOURCE_DB } = process.env;

module.exports = {
  development: {
    username: USER_DB,
    password: PASS_DB,
    database: SOURCE_DB,
    host: "127.0.0.1",
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
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
