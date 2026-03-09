import express from "express";
import Category from "../models/category.js";
import userAuth from "../middleware/auth.js";
import isAdmin from "../middleware/isAdmin.js";

const categoryRouter = express.Router();


// Create Category (Admin)
categoryRouter.post("/categories", userAuth, isAdmin, async (req,res)=>{
  try{

    const category = new Category(req.body);

    await category.save();

    res.send(category);

  }
  catch(err){
    res.status(400).send(err.message);
  }
});


// Get All Categories (Public)
categoryRouter.get("/categories", async (req,res)=>{
  try{

    const categories = await Category.find({ isActive: true });

    res.send(categories);

  }
  catch(err){
    res.status(400).send(err.message);
  }
});


// Update Category (Admin)
categoryRouter.patch("/categories/:id", userAuth, isAdmin, async (req,res)=>{
  try{

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.send(category);

  }
  catch(err){
    res.status(400).send(err.message);
  }
});


// Delete Category (Admin)
categoryRouter.delete("/categories/:id", userAuth, isAdmin, async (req,res)=>{
  try{

    await Category.findByIdAndDelete(req.params.id);

    res.send("Category deleted");

  }
  catch(err){
    res.status(400).send(err.message);
  }
});

export default categoryRouter;