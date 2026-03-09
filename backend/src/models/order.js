import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },

      variantWeight: {
        type: String,
        enum: ["100g", "250g", "500g"],
        required: true
      },

      quantity: {
        type: Number,
        required: true
      },

      price: {
        type: Number,
        required: true
      }
    }
  ],

  totalAmount: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ["pending","confirmed","shipped","delivered","cancelled"],
    default: "pending"
  }

},{
  timestamps:true
});
const Order = mongoose.model("Order", orderSchema);
export default Order;