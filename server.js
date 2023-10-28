import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors"
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";

import fileRoutes from './routes/fileRoutes.js';






//configure env
dotenv.config();

//databse config
connectDB();

//rest object
const app = express();


//middelwares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/v1/auth", authRoutes);
app.use('/api/v1/files', fileRoutes);

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