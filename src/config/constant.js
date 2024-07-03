require("dotenv").config();

const PORT = process.env.PORT;
const DBNAME = process.env.DBNAME;
const USER_NAME = process.env.USER_NAME;
const PASSWORD = process.env.PASSWORD;
const HOST = process.env.HOST;
const DIALECT = process.env.DIALECT;
const SECRET_KEY = process.env.SECRET_KEY;

module.exports = {
  PORT,
  DBNAME,
  USER_NAME,
  PASSWORD,
  DIALECT,
  SECRET_KEY,
  HOST,
};
