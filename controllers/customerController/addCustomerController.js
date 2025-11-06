import Customer from "../../models/customerSchema.js";

//Add New Customer
export const addCustomer = async (req, res, next) => {
  try {
    const { name, contact, location, date } = req.body;

    if (!name || !contact || !location || !date) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      return next(error);
    }

    const newCustomer = await Customer.create({
      name,
      contact,
      location,
      date,
    });

    res.status(201).json({
      success: true,
      message: "Customer added successfully",
      customer: newCustomer,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Customers//
export const getCustomers = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      // Try to convert search into a Date if it's a valid one
      const searchDate = new Date(search);
      const isValidDate = !isNaN(searchDate.getTime());

      if (isValidDate) {
        //Search by date (same-day range)
        const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));

        query = {
          date: { $gte: startOfDay, $lte: endOfDay },
        };
      } else {
        //text-based search (name or location)
        query = {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
          ],
        };
      }
    }

    //Fetch customers//
    const customers = await Customer.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      customers,
    });
  } catch (error) {
    next(error);
  }
};

//Update Customer
export const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, contact, location, date } = req.body;

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { name, contact, location, date },
      { new: true, runValidators: true }
    );

    if (!updatedCustomer) {
      const error = new Error("Customer not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    next(error);
  }
};

//Delete Customer
export const deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedCustomer = await Customer.findByIdAndDelete(id);

    if (!deletedCustomer) {
      const error = new Error("Customer not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
