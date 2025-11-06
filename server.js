import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDb from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import errorhandler from "./middlewares/errorHandling.js";
import { notFoundHandler } from "./middlewares/notFound.js";

const app = express();

//Port comes from .env file//
const PORT = process.env.PORT;

// import errorHandling from './middlewares/errorHandling.js'/ Middleware to parse JSON//
app.use(express.json());

//Enabling CORS for frontend URLs//
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

//Enable cookies//
app.use(cookieParser());

//Routes//
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customers", customerRoutes);

// 404 handler (for unknown routes)
app.use(notFoundHandler);

//Global Error handler//
app.use(errorhandler);

//Starting Server//
app.listen(PORT, () => {
  connectDb();
  console.log(`Server is listening on port ${PORT}`);
});
