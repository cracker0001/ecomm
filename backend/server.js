import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import cookieParser from "cookie-parser";
import authRouter from './src/routes/auth.js';
import profileRouter from './src/routes/profile.js';
import categoryRouter from "./src/routes/category.js";
import productRouter from "./src/routes/product.js";
import orderRouter from "./src/routes/order.js";
import cartRouter from "./src/routes/cart.js";


dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use('/',authRouter);
app.use('/',profileRouter);
app.use("/", categoryRouter);
app.use("/", productRouter);
app.use("/", orderRouter);
app.use("/", cartRouter);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});