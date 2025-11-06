import express from "express";
import {addCustomer,deleteCustomer,getCustomers,updateCustomer} from "../controllers/customerController/addCustomerController.js";

const router = express.Router();

router.post("/", addCustomer);
router.get("/", getCustomers);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

export default router;
