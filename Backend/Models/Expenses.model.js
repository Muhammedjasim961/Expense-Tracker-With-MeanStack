const mongoose = require("mongoose");

const ExpenseSchema = mongoose.Schema({
  expense_name: {
    type: String,
    require: [true, "Type Your Expenses"],
  },
  amount: {
    type: Number,
    require: [true, "Type Amount here"],
    default: 0,
  },
  expense_date: {
    type: Date,
    require: [true, "Type expense date"],
    default: Date.now,
  },
  expense_payment_date: {
    type: Date,
    require: [true, "Type payment Date"],
    default: Date.now,
  },
  expense_category: {
    type: String,
    require: [true, "Type Category"],
  },
  comments: {
    type: String,
    require: [true, "Comments"],
  },
});

const Expense = mongoose.model("Expense", ExpenseSchema);
//in mongodb atlas the Expense looks like expenses its transforms to lower case
module.exports = Expense;
