import express from "express";
import Product from "../models/product.js";
import userAuth from "../middleware/auth.js";
import isAdmin from "../middleware/isAdmin.js";

const productRouter = express.Router();


// CREATE PRODUCT (Admin only)
productRouter.post("/products", userAuth, isAdmin, async (req, res) => {
  try {

    const product = new Product(req.body);

    await product.save();

    res.send(product);
    
  } catch (err) {
    res.status(400).send(err.message);
  }
});


// GET ALL PRODUCTS (Public)
productRouter.get("/products", async (req, res) => {
  try {

    const products = await Product.find({ isActive: true })
      .populate("category");

    res.send(products);

  } catch (err) {
    res.status(400).send(err.message);
  }
});


// GET PRODUCT BY ID
productRouter.get("/products/:id", async (req, res) => {
  try {

    const product = await Product.findById(req.params.id)
      .populate("category");

    res.send(product);

  } catch (err) {
    res.status(400).send(err.message);
  }
});


// UPDATE PRODUCT (Admin)
productRouter.patch("/products/:id", userAuth, isAdmin, async (req, res) => {
  try {

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.send(product);

  } catch (err) {
    res.status(400).send(err.message);
  }
});


// DELETE PRODUCT (Admin)
productRouter.delete("/products/:id", userAuth, isAdmin, async (req, res) => {
  try {

    await Product.findByIdAndDelete(req.params.id);

    res.send("Product deleted");

  } catch (err) {
    res.status(400).send(err.message);
  }
});

export default productRouter;