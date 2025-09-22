// test-no-models.js
const express = require("express");
const app = express();
require("dotenv").config();

console.log("=== TESTING WITHOUT MODELS ===");

// Don't import any models
app.use(express.json());

// Basic route without any database stuff
app.get("/test", (req, res) => {
  res.json({ message: "Test without models" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Test server running on port ${port}`);
});
