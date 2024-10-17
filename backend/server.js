import express from "express";
import cors from "cors";
import dotenv, { config } from "dotenv";
import { connectDb } from "./config.js";
import cookieParser from "cookie-parser";
import AuthRoute from "./routers/auth.routes.js"
import CategoryRoute from "./routers/categories.routes.js";
import TransactionRouter from "./routers/transaction.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const corsOptions = {
  origin: "http://localhost:3002",
  methods:"GET,POST,PUT, PATCH, DELETE, HEAD",
  credentials:true, 
}

//middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//routes
app.use("/", AuthRoute);
app.use("/categories", CategoryRoute );
app.use("/transactions", TransactionRouter);

app.listen(PORT, () => {
    connectDb();
  console.log("Sever Started At:", PORT);
});
