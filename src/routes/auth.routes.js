const express = require("express");
const { uploadImgPath } = require("../models/user.model");
const { register, login, profile } = require("../controllers/user.controller");
const verifyToken = require("../config/verifyToken");
const routes = express.Router();

routes.post("/register", uploadImgPath, register);
routes.post("/login", login);
routes.use(verifyToken);
routes.get("/profile", profile);

module.exports = routes;
