// test-routes.js
const express = require("express");
const app = express();

console.log("Testing route files...");

try {
  const ExpenseRoute = require("./Route/Expense.route");
  app.use("/test-expense", ExpenseRoute);
  console.log("✅ Expense.route.js loaded successfully");
} catch (error) {
  console.log("❌ Error in Expense.route.js:", error.message);
}

try {
  const IndexRouter = require("./Route/index.router");
  app.use("/test-index", IndexRouter);
  console.log("✅ index.router.js loaded successfully");
} catch (error) {
  console.log("❌ Error in index.router.js:", error.message);
}

try {
  const AuthRoute = require("./Route/Auth.route");
  app.use("/test-auth", AuthRoute);
  console.log("✅ Auth.route.js loaded successfully");
} catch (error) {
  console.log("❌ Error in Auth.route.js:", error.message);
}

console.log("Test completed");
