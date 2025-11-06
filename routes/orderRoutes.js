import express from "express";
import {
  addOrder,
  deleteOrder,
  getOrders,
  updateOrder,
  getRevenue,
  getMonthlyRevenue,
} from "../controllers/orderController/addOrderController.js";

const router = express.Router();

router.post("/", addOrder);
router.get("/", getOrders);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);
router.get("/revenue", getRevenue);
router.get("/monthlyrevenue", getMonthlyRevenue);

export default router;
