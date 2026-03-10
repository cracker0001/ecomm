import express from "express";
import Address from "../models/address.js";
import userAuth from "../middleware/auth.js";

const addressRouter = express.Router();


// ADD ADDRESS
addressRouter.post("/address", userAuth, async (req,res)=>{
  try{

    const { name, phone, addressLine, city, state, pincode, isDefault } = req.body;

    const address = new Address({
      user: req.user._id,
      name,
      phone,
      addressLine,
      city,
      state,
      pincode,
      isDefault
    });

    await address.save();

    res.send(address);

  }
  catch(err){
    res.status(400).send(err.message);
  }
});


// GET USER ADDRESSES
addressRouter.get("/address", userAuth, async (req,res)=>{
  try{

    const addresses = await Address.find({ user: req.user._id });

    res.send(addresses);

  }
  catch(err){
    res.status(400).send(err.message);
  }
});


// UPDATE ADDRESS
addressRouter.patch("/address/:id", userAuth, async (req,res)=>{
  try{

    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    res.send(address);

  }
  catch(err){
    res.status(400).send(err.message);
  }
});


// DELETE ADDRESS
addressRouter.delete("/address/:id", userAuth, async (req,res)=>{
  try{

    await Address.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    res.send("Address deleted");

  }
  catch(err){
    res.status(400).send(err.message);
  }
});

export default addressRouter;