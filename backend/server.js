import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./config.js";
import cookieParser from "cookie-parser";
import AuthRoute from "./routers/auth.routes.js";
import CategoryRoute from "./routers/categories.routes.js";
import TransactionRouter from "./routers/transaction.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

/* ✅ FIXED CORS */
const allowedOrigins = [
  "http://localhost:3002",
  "https://expense-tracker-drab-sigma-49.vercel.app" // ❌ no slash
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
  })
);

/* ✅ VERY IMPORTANT */
app.options("*", cors());

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use("/", AuthRoute);
app.use("/categories", CategoryRoute);
app.use("/transactions", TransactionRouter);

app.listen(PORT, () => {
  connectDb();
  console.log(`Server running on port ${PORT}`);
});
