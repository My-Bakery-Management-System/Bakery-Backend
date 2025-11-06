import Expense from "../../models/expenseSchema.js";

// Adding new Expense //
export const addExpense = async (req, res, next) => {
  try {
    const { category, amount, date, note } = req.body;

    if (!category || !amount || !date) {
      const error = new Error("Category, amount, and date are required");
      error.statusCode = 400;
      return next(error);
    }

    const newExpense = await Expense.create({ category, amount, date, note });

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      expense: newExpense,
    });
  } catch (error) {
    next(error);
  }
};
// Getting all Expenses or Searching //
export const getExpenses = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      // Check if search looks like a date (e.g. "2025-11-03")
      const isDate = !isNaN(Date.parse(search));

      if (isDate) {
        // Convert search to date range (so we find all expenses from that day)
        const date = new Date(search);
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);

        query = {
          date: { $gte: date, $lt: nextDay },
        };
      } else {
        // Otherwise search by text (category or note)
        query = {
          $or: [
            { category: { $regex: search, $options: "i" } },
            { note: { $regex: search, $options: "i" } },
          ],
        };
      }
    }

    const expenses = await Expense.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      expenses,
    });
  } catch (error) {
    next(error);
  }
};

// Updating Expense //
export const updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updated = await Expense.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      const error = new Error("Expense not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      expense: updated,
    });
  } catch (error) {
    next(error);
  }
};

// Deleting Expense //
export const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await Expense.findByIdAndDelete(id);

    if (!deleted) {
      const error = new Error("Expense not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
