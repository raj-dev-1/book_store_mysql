const sequelize = require("sequelize");
const { PASSWORD, USER_NAME, DBNAME, DIALECT, HOST } = require("./constant");

const db = new sequelize(DBNAME, USER_NAME, PASSWORD, {
  host: HOST,
  dialect: DIALECT,
  logging: false,
});

db.authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = db;
