import express from 'express';
import userAuth from '../middleware/auth.js';
import {validateEditProfileData} from '../utils/validation.js';
const profileRouter = express.Router();

profileRouter.get('/profile/view', userAuth, async (req,res)=>{
  try{
   
    const user = req.user;
    res.send(user);
  }
  catch(err){
    res.send("something get wrong");
  }
})
profileRouter.patch('/profile/edit',userAuth, async (req,res)=>{
 try{
   if(!validateEditProfileData(req)){
    return res.send("invalid edit request");
  }

   const loggedInUser = req.user;
   Object.keys(req.body).forEach((key)=> (loggedInUser[key] = req.body[key]));
   await loggedInUser.save();
   res.send(`${loggedInUser.firstName} profile updated successfully`);
 }
 catch(err){
  res.send("error in updating profile" + err.message);
 }
})
export default profileRouter;