import express from "express";
import {
  addProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../controllers/productController/addProductController.js";

const router = express.Router();
router.post("/", addProduct);
router.get("/", getProducts);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
