import mongoose, { model, Schema } from "mongoose";

const orderSchema = new Schema(
  {
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
    },
    items: [
      {
        productName: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Completed", "Cancelled"],
      default: "Pending",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

//Prevent OverwriteModelError
const Order = mongoose.models.Order || model("Order", orderSchema);

export default Order;
