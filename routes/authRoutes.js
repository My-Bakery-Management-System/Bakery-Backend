import express from "express";
import { register } from "../controllers/authcontrollers/registerController.js";
import { login } from "../controllers/authcontrollers/loginController.js";
import { logout } from "../controllers/authcontrollers/logout.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
