import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/userRouter.js";
dotenv.config();
const app = express();
import cors from "cors";
import {connectDB} from "./lib/db.js";
app.use(cors());


app.use(express.json());

app.get("/" , (req,res) => {
    res.send("Hello World");
})

app.use("/api/users", userRouter);

app.listen("5000", () => {
    console.log("Server is running on port 5000");
    connectDB();
})
