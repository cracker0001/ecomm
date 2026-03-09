import jwt from "jsonwebtoken";
import User from "../models/user.js";
const userAuth = async (req,res,next) =>{
    try{
      const cookies = req.cookies;
      const {token} = cookies;
      if(!token){
        throw new Error("token is not present");
      }
      const decodeMessage = jwt.verify(token,"secret_key");
      const {_id} = decodeMessage;
      const user = await User.findById(_id);
      if(!user){
        throw new Error("user does not exist");
      }
      req.user = user;
      next();
    }
    catch(err){
      res.status(400).send("unauthenticated user");
    }
}
export default userAuth;