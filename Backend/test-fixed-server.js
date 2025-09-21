// test-fixed-server.js
const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");

console.log("=== TESTING FIXED SERVER STRUCTURE ===");

// Import routes at top level
const ExpenseRoute = require("./Route/Expense.route");
const AuthRoute = require("./Route/Auth.route");
const AuthenticateUser = require("./Route/index.router");

app.use(express.json());

// Basic route
app.get("/test", (req, res) => {
  res.json({ message: "Test route working" });
});

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://jasimwayanad961:ou3mKGK2tVPnTUYh@cluster0.3qqc6xd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("MongoDb is connected");

    // Mount routes (not import)
    app.use("/api/expenses", ExpenseRoute);
    app.use("/api/auth", AuthRoute);
    app.use("/api", AuthenticateUser);

    console.log("Routes mounted successfully");

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Fixed server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Error while connecting mongodb", err);
  });
