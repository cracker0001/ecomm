import express from "express";
import Order from "../models/order.js";
import Product from "../models/product.js";
import userAuth from "../middleware/auth.js";
import isAdmin from "../middleware/isAdmin.js";

const orderRouter = express.Router();


// PLACE ORDER (User)
// orderRouter.post("/orders", userAuth, async (req,res)=>{
//   try{

//     const { productId, variantWeight, quantity } = req.body;

//     const product = await Product.findById(productId);

//     if(!product){
//       return res.status(404).send("Product not found");
//     }

//     const variant = product.variants.find(
//       v => v.weight === variantWeight
//     );

//     if(!variant){
//       return res.status(400).send("Variant not found");
//     }

//     const order = new Order({
//       user: req.user._id,
//       product: productId,
//       variantWeight,
//       quantity,
//       price: variant.price
//     });

//     await order.save();

//     res.send(order);

//   }
//   catch(err){
//     res.status(400).send(err.message);
//   }
// });

orderRouter.post("/orders", userAuth, async (req,res)=>{

  try{

    const { items } = req.body;

    let totalAmount = 0;
    const orderItems = [];

    for(const item of items){

      const product = await Product.findById(item.productId);

      if(!product){
        return res.status(404).send("Product not found");
      }

      const variant = product.variants.find(
        v => v.weight === item.variantWeight
      );

      if(!variant){
        return res.status(400).send("Variant not found");
      }

      const itemTotal = variant.price * item.quantity;

      totalAmount += itemTotal;

      orderItems.push({
        product: item.productId,
        variantWeight: item.variantWeight,
        quantity: item.quantity,
        price: variant.price
      });

    }

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount
    });

    await order.save();

    res.send(order);

  }
  catch(err){
    res.status(400).send(err.message);
  }

});
// GET USER ORDERS
orderRouter.get("/orders", userAuth, async (req,res)=>{
  try{

    const orders = await Order.find({ user: req.user._id })
      .populate("product");

    res.send(orders);

  }
  catch(err){
    res.status(400).send(err.message);
  }
});


// ADMIN → GET ALL ORDERS
orderRouter.get("/admin/orders", userAuth, isAdmin, async (req,res)=>{
  try{

    const orders = await Order.find()
      .populate("product")
      .populate("user");

    res.send(orders);

  }
  catch(err){
    res.status(400).send(err.message);
  }
});


// ADMIN → UPDATE ORDER STATUS
orderRouter.patch("/orders/:id", userAuth, isAdmin, async (req,res)=>{
  try{

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new:true }
    );

    res.send(order);

  }
  catch(err){
    res.status(400).send(err.message);
  }
});

export default orderRouter;