import validator from 'validator';

export const validateSignUpData = (req)=>{
 const { name, email, phone, password, role } = req.body;

if (!name) {
  throw new Error("Name is required");
}

if (!email || !validator.isEmail(email)) {
  throw new Error("Invalid email");
}

if (!password || !validator.isStrongPassword(password)) {
  throw new Error("Invalid password");
}

if (!phone || !validator.isMobilePhone(phone, "en-IN")) {
  throw new Error("Invalid phone number");
}

if (role && !["user", "admin"].includes(role)) {
  throw new Error("Invalid role");
}
}

export const validateEditProfileData = (req) =>{
    const allowedEditFields = [
     "name",
    "email",
    "phone"
    ];
    const isEditAllowed = Object.keys(req.body).every((field)=> allowedEditFields.includes(field));
   
    return isEditAllowed;
}