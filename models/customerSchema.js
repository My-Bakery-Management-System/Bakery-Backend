import mongoose, { Schema, model } from "mongoose";

// Define the customer schema
const customerSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    contact: {
      type: String,
      required: [true, "Contact is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
  },
  { timestamps: true }
);

// Create the model
const Customer = model("Customer", customerSchema);

export default Customer;
