// debug-server.js
const express = require("express");
const app = express();
require("dotenv").config();

console.log("=== DEBUGGING SERVER.JS ===");

// Test middleware one by one
try {
  app.use(express.json());
  console.log("✅ express.json() - OK");
} catch (error) {
  console.log("❌ express.json() - ERROR:", error.message);
}

try {
  app.use(express.urlencoded({ extended: true }));
  console.log("✅ express.urlencoded() - OK");
} catch (error) {
  console.log("❌ express.urlencoded() - ERROR:", error.message);
}

// Test route imports one by one
try {
  const ExpenseRoute = require("./Route/Expense.route");
  console.log("✅ Expense.route import - OK");
} catch (error) {
  console.log("❌ Expense.route import - ERROR:", error.message);
}

try {
  const AuthRoute = require("./Route/Auth.route");
  console.log("✅ Auth.route import - OK");
} catch (error) {
  console.log("❌ Auth.route import - ERROR:", error.message);
}

try {
  const AuthenticateUser = require("./Route/index.router");
  console.log("✅ index.router import - OK");
} catch (error) {
  console.log("❌ index.router import - ERROR:", error.message);
}

// Test route mounting
try {
  const ExpenseRoute = require("./Route/Expense.route");
  app.use("/test-expense", ExpenseRoute);
  console.log("✅ ExpenseRoute mounting - OK");
} catch (error) {
  console.log("❌ ExpenseRoute mounting - ERROR:", error.message);
}

try {
  const AuthRoute = require("./Route/Auth.route");
  app.use("/test-auth", AuthRoute);
  console.log("✅ AuthRoute mounting - OK");
} catch (error) {
  console.log("❌ AuthRoute mounting - ERROR:", error.message);
}

try {
  const AuthenticateUser = require("./Route/index.router");
  app.use("/test-index", AuthenticateUser);
  console.log("✅ index.router mounting - OK");
} catch (error) {
  console.log("❌ index.router mounting - ERROR:", error.message);
}

console.log("=== SERVER.JS DEBUG COMPLETE ===");
