const express = require("express");
const Router = express.Router();
const AuthController = require("../Controllers/Auth.controller.js");

Router.post("/register", AuthController.userRegister);
Router.post("/login", AuthController.userLogin);
// Router.post("/profile", AuthController);
// Router.get("/profile", AuthController);

module.exports = Router;
