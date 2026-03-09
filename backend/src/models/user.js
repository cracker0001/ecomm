import mongoose from 'mongoose';
import validator from 'validator'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const userSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email must be valid");
      }
    }
  },

  phone: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isMobilePhone(value, "en-IN")) {
        throw new Error("Invalid phone number");
      }
    }
  },

  password: {
    type: String,
    required: true,
    minLength: 6
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }

},
{
  timestamps: true
});


//create schema methods
userSchema.methods.getJWT = async function(){
  const user = this;
  const token = await jwt.sign({_id: user._id}, "secret_key",{expiresIn: '1d'});
  return token;
}
userSchema.methods.validatePassword = async function(password){
  const user = this;
  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch;
}
const User = mongoose.model("User",userSchema);
export default User;