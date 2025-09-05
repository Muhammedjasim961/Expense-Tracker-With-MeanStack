const express = require("express");
const Router = express.Router();
const ExpenseController = require("../Controllers/Expenses.controller.js");

Router.get("/", ExpenseController.getAllExpense);
Router.post("/insertExpense", ExpenseController.createExpense);
Router.get("/expense/:id", ExpenseController.getExpenseById);
Router.put("/updateExpense/:id", ExpenseController.updateExpense);
Router.delete("/deleteExpense/:id", ExpenseController.deleteExpense);

module.exports = Router;
