const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const Expense = require("./Models/Expenses.model");
const User = require("./Models/User.model");
const mongoose = require("mongoose");
const ExpenseRoute = require("./Route/Expense.route");
const AuthRoute = require("./Route/Auth.route");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");
// Or allow all origins (for testing)
app.use(cors());
app.options("/api/auth/register", (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.status(200).send();
});

// Debug JWT secret
console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
console.log("JWT_SECRET length:", process.env.JWT_SECRET?.length);
// ================= ROUTES =================
// Add this before your routes to see all incoming requests
app.use((req, res, next) => {
  console.log("=== INCOMING REQUEST ===");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("Original URL:", req.originalUrl);
  console.log("=======================");
  next();
});
// ================= MIDDLEWARE =================
app.use((req, res, next) => {
  console.log(
    new Date().toISOString(),
    req.method,
    req.originalUrl,
    "Origin:",
    req.headers.origin
  );
  next();
});

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.status(200).end();
  }
  next();
});

// CORS configuration
app.use(
  cors({
    origin: [
      "https://expense-tracker-backend-bwt0.onrender.com", // Your Render URL
      "http://localhost:4200", // Angular dev server
      "http://localhost:3005", // Your local backend
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ================= BASIC HEALTH CHECK =================
app.get("/health", (req, res) => {
  res.json({ status: "OK", db: mongoose.connection.readyState });
});
// ================= DATABASE CONNECTION =================

mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => {
    // API ROUTES FIRST
    app.use("/api", ExpenseRoute); // ✅ All expense routes under /api/expenses
    app.use("/api/auth", AuthRoute); // ✅ All auth routes under /api/auth
    console.log("MongoDb is connected");

    // PROFILE ROUTES
    app.get("/api/profile", auth, async (req, res) => {
      try {
        const profile = await User.findById(req.user.id);
        if (!profile) {
          return res.status(404).json({ message: "User not found" });
        }
        res.json(profile);
      } catch (error) {
        res.status(500).json({ message: "Error fetching profile", error });
      }
    });

    app.put("/api/profile", authMiddleware, async (req, res) => {
      try {
        const { username, email } = req.body;
        const existingUser = await User.findOne({
          email,
          _id: { $ne: req.user.id },
        });
        if (existingUser) {
          return res.status(400).json({ message: "Email already in use" });
        }

        const updatedUser = await User.findByIdAndUpdate(
          req.user.id,
          { username, email },
          { new: true }
        );

        if (!updatedUser) {
          return res.status(404).json({ message: "User not found" });
        }

        res.json(updatedUser);
      } catch (error) {
        res.status(500).json({ message: "Error updating profile", error });
      }
    });

    // DEBUG ROUTES
    app.get("/api/token-info", (req, res) => {
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) return res.status(400).json({ message: "No token provided" });

      const decoded = jwt.decode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      const isExpired = decoded.exp < currentTime;

      res.json({
        issuedAt: new Date(decoded.iat * 1000).toISOString(),
        expiresAt: new Date(decoded.exp * 1000).toISOString(),
        currentTime: new Date().toISOString(),
        isExpired: isExpired,
        secondsUntilExpiry: isExpired ? 0 : decoded.exp - currentTime,
      });
    });

    app.get("/api/time-debug", (req, res) => {
      res.json({
        server_time: new Date().toISOString(),
        server_timestamp: Date.now(),
        server_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    });

    // Pagination EXPENSES ROUTE
    app.get("/expenses", async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const expenses = await Expense.find().skip(skip).limit(limit);
        const total = await Expense.countDocuments();

        res.json({
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          totalRecords: total,
          expenses,
        });
      } catch (error) {
        res.status(500).json({ message: "Error fetching expenses", error });
      }
    });

    // ================= STATIC FILES =================
    // This is crucial - serve static files correctly
    app.use(express.static(path.join(__dirname, "public", "browser")));
    // ================= SAFE CATCH-ALL ROUTE =================

    //happened express version issue npm list express path-to-regexp while caching all route
    app.get("/*", (req, res) => {
      if (req.url.startsWith("/api/") || req.url.includes(".")) {
        return res.status(404).json({ message: "Not found" });
      }
      console.log("Serving Angular app for:", req.url);
      res.sendFile(path.join(__dirname, "public", "browser", "index.html"));
    });

    // ================= ERROR HANDLERS =================
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ message: "Something went wrong!" });
    });

    // ================= START SERVER =================
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Error while connecting mongodb", err);
  });

// ================= AUTH MIDDLEWARES =================
function auth(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(401).json({ message: "Token verification failed" });
  }
}
// app.get(/^\/(?!api)/, (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "browser", "index.html"));
// });
// // Handle common Angular routes explicitly

// const angularRoutes = ["/register", "/login", "/dashboard", "/profile"];
// angularRoutes.forEach((route) => {
//   app.get(route, (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "browser", "index.html"));
//   });
// });
