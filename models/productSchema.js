import { model, Schema } from 'mongoose'

const productSchema = new Schema (
    {
name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: 0,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
  }, {timestamps: true}
)



const Product = model('Product', productSchema)

export default Product

