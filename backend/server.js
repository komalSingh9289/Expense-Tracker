import express from "express";
import cors from "cors";
import dotenv, { config } from "dotenv";
import { connectDb } from "./config.js";
import cookieParser from "cookie-parser";
import AuthRoute from "./routers/auth.routes.js"
import CategoryRoute from "./routers/categories.routes.js";
import TransactionRouter from "./routers/transaction.routes.js";
import aiRoutes from "./routers/aiChat.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const corsOptions = {
  origin: ["http://localhost:3002", "http://localhost:5173", "http://localhost:3000", 
    "https://expense-tracker-drab-sigma-49.vercel.app/"
  ],
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
app.use("/api/ai", aiRoutes);

app.listen(PORT, () => {
    connectDb();
 
});
