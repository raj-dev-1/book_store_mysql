const express = require("express");
const verifyToken = require("../config/verifyToken");
const {
  create,
  list,
  update,
  remove,
  bookDetails,
} = require("../controllers/book.controller");

const routes = express.Router();

routes.use(verifyToken);
routes.post("/", create);
routes.get("/", list);
routes.get("/:id", bookDetails);
routes.put("/:id", update);
routes.delete("/:id", remove);

module.exports = routes;
