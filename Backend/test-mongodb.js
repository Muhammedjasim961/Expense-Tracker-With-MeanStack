// test-mongodb.js
const mongoose = require("mongoose");
require("dotenv").config();

console.log("=== TESTING MONGODB CONNECTION ONLY ===");

// Test connection without any Express stuff
mongoose
  .connect(
    "mongodb+srv://jasimwayanad961:ou3mKGK2tVPnTUYh@cluster0.3qqc6xd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log("❌ MongoDB connection error:", err.message);
    console.log("Error type:", err.name);
  });
