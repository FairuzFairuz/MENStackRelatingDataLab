import express from "express";
import router from "./src/routes/food.js";
import dotenv from "dotenv";
dotenv.config();
import authRouter from "./src/routes/auth.js";
import mongoose from "mongoose";
import foodRouter from "./src/routes/food.js";
import userRouter from "./src/routes/user.js";

const app = express();
app.set("view engine", "ejs");
app.set("views", "./views");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true, //prevents deprecated connection warnings -- optional but better ti put
    useUnifiedTopology: true, // improves monitoring, connection handling n failover behavior -- optional but better to put
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/auth", authRouter);
app.use("/api", foodRouter);
app.use("/api", userRouter);

const PORT = process.env.PORT || 4000; // Fallback to 4000 if not set in .env

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
