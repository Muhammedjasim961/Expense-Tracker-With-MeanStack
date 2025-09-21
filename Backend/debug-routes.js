// debug-routes.js
const express = require("express");
const app = express();

console.log("=== DEBUGGING ROUTE CONFLICTS ===");

// Test each router separately
const ExpenseRoute = require("./Route/Expense.route");
const AuthenticateUser = require("./Route/index.router");
const AuthRoute = require("./Route/Auth.route");

console.log("\n1. ExpenseRoute paths:");
ExpenseRoute.stack.forEach((layer) => {
  if (layer.route) {
    console.log(`   ${Object.keys(layer.route.methods)} ${layer.route.path}`);
  }
});

console.log("\n2. AuthenticateUser paths:");
AuthenticateUser.stack.forEach((layer) => {
  if (layer.route) {
    console.log(`   ${Object.keys(layer.route.methods)} ${layer.route.path}`);
  } else if (layer.name === "router") {
    console.log(`   ⚠️ Contains nested router: ${layer.regexp}`);
  }
});

console.log("\n3. AuthRoute paths:");
AuthRoute.stack.forEach((layer) => {
  if (layer.route) {
    console.log(`   ${Object.keys(layer.route.methods)} ${layer.route.path}`);
  }
});

// Test if they work together
console.log("\n4. Testing combination...");
try {
  const testApp = express();
  testApp.use("/", ExpenseRoute);
  testApp.use("/", AuthenticateUser);
  testApp.use("/", AuthRoute);
  console.log("   ✅ All routers work together");
} catch (error) {
  console.log("   ❌ Error when combining routers:", error.message);
}
