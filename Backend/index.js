const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const Expense = require("./Models/Expenses.model");
const User = require("./Models/User.model");
const mongoose = require("mongoose");
const ExpenseRoute = require("./Route/Expense.route");
const AuthenticateUser = require("./Route/index.router");
const cors = require("cors");
const jwt = require("jsonwebtoken");

app.use(cors()); // Enable CORS for your frontend
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());
// parse application/json
app.use(bodyParser.json());
const port = process.env.PORT;
app.use(express.json());
app.use("/", ExpenseRoute);
app.use("/", AuthenticateUser);
app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
mongoose
  .connect(
    "mongodb+srv://jasimwayanad961:ou3mKGK2tVPnTUYh@cluster0.3qqc6xd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`Port is running on ${port}`);
    });

    console.log("MongoDb is connected");
  })
  .catch((err) => {
    console.log("Error while connecting mongodb", err);
  });

const auth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Now req.user.id is available
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// find profile  id
app.get("/profile", auth, async (req, res) => {
  try {
    const profile = await User.findById(req.user.id); // assuming Mongoose
    if (!profile) {
      console.log("profile", error);
      return res.status(404).json({ message: "User not found" });
    }
    res.json(profile);
  } catch (error) {
    console.log("error", error);

    res.status(500).json({ message: "Error fetching profile", error });
  }
});

function authMiddleware(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  console.log("Got token:", token); // debug
  console.log("JWT_SECRET used:", process.env.JWT_SECRET);

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }
      req.user = decoded;
      next();
    });
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
}

// Update profile (update)
app.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { username, email } = req.body;

    // Find if email already exists for another user
    const existingUser = await User.findOne({
      email,
      _id: { $ne: req.user.id },
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Update the user
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
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile", error });
  }
});
// GET /expenses?page=1&limit=5
app.get("/expenses", async (req, res) => {
  try {
    //setting query params to pick up page and limit

    const page = parseInt(req.query.page) || 1; //default page number is 1
    const limit = parseInt(req.query.limit) || 5; // default 10 pages limit

    // Calculate how many records to skip
    const skip = (page - 1) * limit;

    // Fetch expenses with skip and limit
    const expenses = await Expense.find().skip(skip).limit(limit);

    // Count total expenses
    const total = await Expense.countDocuments();
    res.json({
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalRecords: total,
      expenses,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses", error: err });
  }
});
//get expense by id

// app.post("/insertExpense", async (req, res) => {
//   try {
//     const expense = await Expense.create(req.body);
//     res.status(200).json(expense);
//     console.log("to create data", expense);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
//port
