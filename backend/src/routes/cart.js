import express from "express";
import Cart from "../models/cart.js";
import Product from "../models/product.js";
import userAuth from "../middleware/auth.js";

const cartRouter = express.Router();


// ADD TO CART
cartRouter.post("/cart", userAuth, async (req,res)=>{
  try{

    const { productId, variantWeight, quantity } = req.body;

    const product = await Product.findById(productId);

    if(!product){
      return res.status(404).send("Product not found");
    }

    const variant = product.variants.find(
      v => v.weight === variantWeight
    );

    if(!variant){
      return res.status(400).send("Variant not available");
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if(!cart){
      cart = new Cart({
        user: req.user._id,
        items: []
      });
    }

    const existingItem = cart.items.find(
      item =>
        item.product.toString() === productId &&
        item.variantWeight === variantWeight
    );

    if(existingItem){
      existingItem.quantity += quantity;
    }else{
      cart.items.push({
        product: productId,
        variantWeight,
        quantity
      });
    }

    await cart.save();

    res.send(cart);

  }
  catch(err){
    res.status(400).send(err.message);
  }
});

// GET CART
cartRouter.get("/cart", userAuth, async (req,res)=>{
  try{

    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product");

    res.send(cart);

  }
  catch(err){
    res.status(400).send(err.message);
  }
});


// REMOVE ITEM FROM CART
cartRouter.delete("/cart/:itemId", userAuth, async (req,res)=>{
  try{

    const cart = await Cart.findOne({ user: req.user._id });

    cart.items = cart.items.filter(
      item => item._id.toString() !== req.params.itemId
    );

    await cart.save();

    res.send(cart);

  }
  catch(err){
    res.status(400).send(err.message);
  }
});


// CLEAR CART
cartRouter.delete("/cart", userAuth, async (req,res)=>{
  try{

    await Cart.findOneAndDelete({ user: req.user._id });

    res.send("Cart cleared");

  }
  catch(err){
    res.status(400).send(err.message);
  }
});

export default cartRouter;