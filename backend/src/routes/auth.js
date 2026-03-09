import express from 'express';
const authRouter = express.Router();
import {validateSignUpData} from '../utils/validation.js'
import bcrypt from 'bcrypt'
import User from '../models/user.js';

authRouter.post('/signup', async (req,res)=>{
  try{
   validateSignUpData(req);
    const { name, email, phone, password, role } = req.body;
    const hashpassword = await bcrypt.hash(password,10);

     const userDetail = new User({
      name,
      email,
      password: hashpassword,
      phone,
      role,
     });
    await userDetail.save();
   res.send("data stored")
  }
  catch(err){
    res.send("something wrong" + err.message);
  }
})
authRouter.post('/login', async (req,res)=>{
  const {email, password} = req.body;
  try{
    const user = await User.findOne({email: email});
    if(!user){
      throw new Error("user not found")
    }
    const checkPassword = await user.validatePassword(password);
    if(checkPassword)
    {
      const token = await user.getJWT();
      res.cookie("token",token);
      res.send("login successful");
    }
    else{
      res.send("login unsuccess");
    }
  }
  catch(err){
    res.send("something is wrong");
  }
})

authRouter.post('/logout',(req,res)=>{
  res.cookie("token",null,{
    expires: new Date(Date.now())
  }
  );
  res.send("logout successful");
});


export default authRouter;