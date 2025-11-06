import Order from "../../models/orderSchema.js";

// Add new order
export const addOrder = async (req, res, next) => {
  try {
    const { customerName, items, date, status } = req.body;

    // Validation
    if (!customerName || !items?.length || !date) {
      const error = new Error("All required fields must be provided");
      error.statusCode = 400;
      return next(error);
    }

    // ✅ Automatically calculate total amount from item prices
    const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

    const newOrder = await Order.create({
      customerName,
      items,
      totalAmount,
      status: status || "Pending",
      date,
    });

    res.status(201).json({
      success: true,
      message: "Order added successfully",
      order: newOrder,
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders or search by customer name, status, or date
export const getOrders = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      // Try to detect if search looks like a date
      const dateSearch = new Date(search);
      const isValidDate = !isNaN(dateSearch);

      if (isValidDate) {
        // If it's a valid date string (e.g. 2025-11-04)
        const nextDay = new Date(dateSearch);
        nextDay.setDate(dateSearch.getDate() + 1);

        query = {
          date: { $gte: dateSearch, $lt: nextDay }, // date range for that day
        };
      } else {
        // Otherwise, search text fields only
        query = {
          $or: [
            { customerName: { $regex: search, $options: "i" } },
            { status: { $regex: search, $options: "i" } },
          ],
        };
      }
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// Update an order
export const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { customerName, items, totalAmount, date, status } = req.body; // 👈 added status

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { customerName, items, totalAmount, date, status }, // 👈 added status here
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      const error = new Error("Order not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// Delete an order
export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      const error = new Error("Order not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get total revenue (Completed orders only)
export const getRevenue = async (req, res, next) => {
  try {
    const completedOrders = await Order.find({ status: "Completed" });

    const totalRevenue = completedOrders.reduce(
      (acc, order) => acc + (order.totalAmount || 0),
      0
    );

    res.status(200).json({ success: true, totalRevenue });
  } catch (error) {
    next(error);
  }
};

// Get monthly revenue
export const getMonthlyRevenue = async (req, res, next) => {
  try {
    const now = new Date();

    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfCurrentMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59
    );

    const currentMonthTotal = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const lastMonthTotal = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    res.json({
      currentMonth: currentMonthTotal[0]?.total || 0,
      lastMonth: lastMonthTotal[0]?.total || 0,
    });
  } catch (error) {
    console.error("Error fetching monthly revenue:", error);
    res.status(500).json({ message: "Failed to fetch monthly revenue" });
  }
};
