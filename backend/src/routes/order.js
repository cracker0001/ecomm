// import express from "express";
// import Order from "../models/order.js";
// import Product from "../models/product.js";
// import userAuth from "../middleware/auth.js";
// import isAdmin from "../middleware/isAdmin.js";

// const orderRouter = express.Router();

// orderRouter.post("/orders", userAuth, async (req,res)=>{

//   try{

//     const { items } = req.body;

//     let totalAmount = 0;
//     const orderItems = [];

//     for(const item of items){

//       const product = await Product.findById(item.productId);

//       if(!product){
//         return res.status(404).send("Product not found");
//       }

//       const variant = product.variants.find(
//         v => v.weight === item.variantWeight
//       );

//       if(!variant){
//         return res.status(400).send("Variant not found");
//       }

//       const itemTotal = variant.price * item.quantity;

//       totalAmount += itemTotal;

//       orderItems.push({
//         product: item.productId,
//         variantWeight: item.variantWeight,
//         quantity: item.quantity,
//         price: variant.price
//       });

//     }

//     const order = new Order({
//       user: req.user._id,
//       items: orderItems,
//       totalAmount
//     });

//     await order.save();

//     res.send(order);

//   }
//   catch(err){
//     res.status(400).send(err.message);
//   }

// });
// // GET USER ORDERS
// orderRouter.get("/orders", userAuth, async (req,res)=>{
//   try{

//     const orders = await Order.find({ user: req.user._id })
//       .populate("product");

//     res.send(orders);

//   }
//   catch(err){
//     res.status(400).send(err.message);
//   }
// });


// // ADMIN → GET ALL ORDERS
// orderRouter.get("/admin/orders", userAuth, isAdmin, async (req,res)=>{
//   try{

//     const orders = await Order.find()
//       .populate("product")
//       .populate("user");

//     res.send(orders);

//   }
//   catch(err){
//     res.status(400).send(err.message);
//   }
// });


// // ADMIN → UPDATE ORDER STATUS
// orderRouter.patch("/orders/:id", userAuth, isAdmin, async (req,res)=>{
//   try{

//     const order = await Order.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new:true }
//     );

//     res.send(order);

//   }
//   catch(err){
//     res.status(400).send(err.message);
//   }
// });

// export default orderRouter;
import express from "express";
import Order from "../models/order.js";
import Product from "../models/product.js";
import Cart from "../models/cart.js";
import Address from "../models/address.js";
import userAuth from "../middleware/auth.js";
import isAdmin from "../middleware/isAdmin.js";

const orderRouter = express.Router();



/*
CREATE ORDER
Supports:
1️⃣ Cart Checkout
2️⃣ Buy Now
*/

orderRouter.post("/orders", userAuth, async (req,res)=>{

  try{

    const { addressId, buyNowItem } = req.body;

    const address = await Address.findById(addressId);

    if(!address){
      return res.status(404).send("Address not found");
    }

    let items = [];



    // BUY NOW FLOW
    if(buyNowItem){

      const product = await Product.findById(buyNowItem.productId);

      if(!product){
        return res.status(404).send("Product not found");
      }

      const variant = product.variants.find(
        v => v.weight === buyNowItem.variantWeight
      );

      if(!variant){
        return res.status(400).send("Variant not found");
      }

      items.push({
        product: buyNowItem.productId,
        variantWeight: buyNowItem.variantWeight,
        quantity: buyNowItem.quantity,
        price: variant.price
      });

    }


    // CART CHECKOUT FLOW
    else{

      const cart = await Cart.findOne({ user: req.user._id });

      if(!cart || cart.items.length === 0){
        return res.status(400).send("Cart is empty");
      }

      for(const item of cart.items){

        const product = await Product.findById(item.product);

        const variant = product.variants.find(
          v => v.weight === item.variantWeight
        );

        items.push({
          product: item.product,
          variantWeight: item.variantWeight,
          quantity: item.quantity,
          price: variant.price
        });

      }

      await Cart.findOneAndDelete({ user: req.user._id });

    }



    // CALCULATE TOTAL
    let totalAmount = 0;

    items.forEach(item=>{
      totalAmount += item.price * item.quantity;
    });



    const order = new Order({
      user: req.user._id,
      items,
      address: addressId,
      totalAmount
    });

    await order.save();

    res.send(order);

  }

  catch(err){
    res.status(400).send(err.message);
  }

});



/* GET USER ORDERS */

orderRouter.get("/orders", userAuth, async (req,res)=>{
  try{

    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .populate("address");

    res.send(orders);

  }
  catch(err){
    res.status(400).send(err.message);
  }
});



/* ADMIN → GET ALL ORDERS */

orderRouter.get("/admin/orders", userAuth, isAdmin, async (req,res)=>{
  try{

    const orders = await Order.find()
      .populate("items.product")
      .populate("user")
      .populate("address");

    res.send(orders);

  }
  catch(err){
    res.status(400).send(err.message);
  }
});



/* ADMIN → UPDATE ORDER STATUS */

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