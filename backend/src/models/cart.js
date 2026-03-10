import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
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
    required: true,
    default: 1
  }

});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  items: [cartItemSchema]

},{
  timestamps: true
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;