const { models } = require("mongoose");
const Expense = require("../Models/Expenses.model");

const getAllExpense = async (req, res) => {
  try {
    const expense = await Expense.find({});
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createExpense = async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    if (!expense) {
      alert("something wrong");
    }
    res.status(200).json(expense);
    console.log("to create data", expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findById(id);
    if (!expense) {
      res.status(401).json({ message: "Cannot find any expenses" });
    }
    res.status(200).json({ message: expense });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByIdAndUpdate(id, req.body);

    if (!expense) {
      res.status(401).json({ message: "error in updating this expense" });
    }
    res.status(201).json({ message: expense });
  } catch (error) {
    res.status(500).json({ message: error });
    console.log("error in update expense", error);
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByIdAndDelete(id);

    if (!expense) {
      res.status(401).json({ message: "Cannot delete Expense" });
    }
    res.status(201).json({ message: "Expense Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("error in deleting", error);
  }
};
module.exports = {
  getAllExpense,
  createExpense,
  getExpenseById,
  updateExpense,
  deleteExpense,
};
