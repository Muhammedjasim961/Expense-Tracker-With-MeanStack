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
  },
  expense_payment_type: {
    type: String,
    require: [true, "Type payment Type"],
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
