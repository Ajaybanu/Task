import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import fs from "fs"







//configure env
dotenv.config();

//databse config
connectDB();

//rest object
const app = express();


//middelwares

app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/v1/auth", authRoutes);

//rest api
app.get("/", (req, res) => {
  res.send("<h1>role-based auth</h1>");
});

//PORT
const PORT = process.env.PORT || 3001;

//run listen
app.listen(PORT, () => {
  console.log(
    `Server Running on port ${PORT}`
  );
});