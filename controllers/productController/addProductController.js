import Product from "../../models/productSchema.js";

//Adding new Products//
export const addProduct = async (req, res, next) => {
  try {
    const { name, quantity, date } = req.body;

    if (!name || !quantity || !date) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      return next(error);
    }

    const newProduct = await Product.create({ name, quantity, date });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

// controllers/productController.js
export const getProducts = async (req, res, next) => {
  try {
    const { search } = req.query; // get search term from query string

    let query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" }; // case-insensitive search
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

//Updating Product//
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updated,
    });
  } catch (error) {
    next(error);
  }
};

//Deleting a product //
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
