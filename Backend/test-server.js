const express = require("express");
const app = express();
const path = require("path");

// Only basic setup - no routes, no database
app.use(express.json());

// Test the catch-all route alone
app.use(express.static(path.join(__dirname, "public", "browser")));

app.get("*", (req, res) => {
  console.log("Catch-all route for:", req.url);
  res.send("Catch-all working");
});

const port = 3001;
app.listen(port, () => {
  console.log(`Test server running on port ${port}`);
});
