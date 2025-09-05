const express = require("express");
const Router = express.Router();
const Expenses = require("./Expense.route");
const authUser = require("./Auth.route.js");
Router.use("/", Expenses);
Router.use("/", authUser);

module.exports = Router;
