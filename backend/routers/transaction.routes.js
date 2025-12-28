import e from "express";
import { addTransaction, getRecentTransactions, getTransactions, downloadTransactions } from "../controllers/transaction.controllers.js";
import { protect } from "../middleware/auth.middleware.js";


const router = e.Router();

router.post("/", protect, addTransaction);
router.get("/recent", protect, getRecentTransactions);
router.get("/", protect, getTransactions);
router.get("/transactions/export", protect, downloadTransactions);

export default router;