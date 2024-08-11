import express from "express";
import router from "./routes/router.js";
import cors from "cors";
import connectDB from "./db.js";
import dotenv from "dotenv";
dotenv.config()
const app = express();
app.use(express.json());
connectDB();
const frontendUrl = process.env.FRONTEND_URL;
app.use(
  cors({
    origin:frontendUrl,
    methods: ["GET", "POST", "PUT", "DELETE"]
  })
);
app.use(function (request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use("/", router);
app.get("/", (req, res) => {
  res.send("hello");
});
app.listen(5000, () => {
  console.log("app running at 5000");
});
