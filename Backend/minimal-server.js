// minimal-server.js
const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");

console.log("=== STARTING MINIMAL SERVER ===");

// NO routes, NO middleware except basic JSON
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://jasimwayanad961:ou3mKGK2tVPnTUYh@cluster0.3qqc6xd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("MongoDb is connected");

    // Only one basic route
    app.get("/test", (req, res) => {
      res.json({ message: "Minimal server working!" });
    });

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Minimal server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Error while connecting mongodb", err);
  });
