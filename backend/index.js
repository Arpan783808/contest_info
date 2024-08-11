import express from "express";
import router from "./routes/router.js";
import cors from "cors";
import connectDB from "./db.js";
const app=express();
app.use(express.json());
connectDB();
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use("/",router);
app.get("/",(req,res)=>{
    res.send("hello");
})
app.listen(5000,()=>{
    console.log("app running at 5000");
});