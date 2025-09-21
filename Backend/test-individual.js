// test-individual.js
const express = require("express");
const app = express();

console.log("Testing individual route files...");

// Test 1: ExpenseRoute alone
try {
  const ExpenseRoute = require("./Route/Expense.route");
  const testApp = express();
  testApp.use("/", ExpenseRoute);
  console.log("✅ Expense.route.js - OK");
} catch (error) {
  console.log("❌ Expense.route.js - ERROR:", error.message);
}

// Test 2: AuthRoute alone
try {
  const AuthRoute = require("./Route/Auth.route");
  const testApp = express();
  testApp.use("/", AuthRoute);
  console.log("✅ Auth.route.js - OK");
} catch (error) {
  console.log("❌ Auth.route.js - ERROR:", error.message);
}

// Test 3: index.router alone
try {
  const IndexRouter = require("./Route/index.router");
  const testApp = express();
  testApp.use("/", IndexRouter);
  console.log("✅ index.router.js - OK");
} catch (error) {
  console.log("❌ index.router.js - ERROR:", error.message);
}

// Test 4: All together
try {
  const ExpenseRoute = require("./Route/Expense.route");
  const AuthRoute = require("./Route/Auth.route");
  const IndexRouter = require("./Route/index.router");

  const testApp = express();
  testApp.use("/", ExpenseRoute);
  testApp.use("/", AuthRoute);
  testApp.use("/", IndexRouter);
  console.log("✅ All routers together - OK");
} catch (error) {
  console.log("❌ All routers together - ERROR:", error.message);
}
