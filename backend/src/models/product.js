import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  weight: {
    type: String,
    enum: ["100g", "250g", "500g"],
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  stock: {
    type: Number,
    default: 0
  },

  images: [
    {
      type: String
    }
  ]
});

const productSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    trim: true
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },

  variants: [variantSchema],

  isActive: {
    type: Boolean,
    default: true
  }

},
{
  timestamps: true
});

const Product = mongoose.model("Product", productSchema);

export default Product;

