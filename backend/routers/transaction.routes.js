import e from "express";
import { addTransaction, getRecentTransactions, getTransactions, downloadTransactions, updateTransactions, removeTransactions, removeManyTransactions, getTransactionsByDate } from "../controllers/transaction.controllers.js";
import { protect } from "../middleware/auth.middleware.js";


const router = e.Router();

router.post("/", protect, addTransaction);
router.get("/recent", protect, getRecentTransactions);
router.get("/", protect, getTransactions);
router.get("/export", protect, downloadTransactions);
router.post("/get-by-date", protect, getTransactionsByDate);
router.post("/delete-many", protect, removeManyTransactions);
router.patch("/:id", protect, updateTransactions);
router.delete("/:id", protect, removeTransactions);

export default router;