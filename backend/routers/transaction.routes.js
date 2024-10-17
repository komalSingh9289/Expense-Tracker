import e from "express";
import { addTransaction, getRecentTransactions, getTransactions } from "../controllers/transaction.controllers.js";


const router = e.Router();

router.post("/", addTransaction);
router.get("/recent", getRecentTransactions);
router.get("/", getTransactions);

export default router;