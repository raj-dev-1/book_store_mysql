const db = require("../config/sequelize.js");

(async () => {
  try {
    await db.sync({ alert: true });
    console.log("Tables synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing tables: ", error);
  }
})();

module.exports = db;
