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

app.use(cors()); // Enable CORS for your frontend
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());
// parse application/json
app.use(bodyParser.json());
const port = process.env.PORT;
app.use(express.json());
app.use("/", ExpenseRoute);
app.use("/", AuthenticateUser);
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
