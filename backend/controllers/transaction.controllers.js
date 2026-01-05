import multer from "multer";
import path from "path";
import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";
import PDFDocument from "pdfkit";
import upload from "../util/multer.js";
import { uploadToCloudinary } from "../util/uploadToCloudinary.js";

export const addTransaction = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || err,
      });
    }

    const userId = req.user._id;
    const { categoryId, amount, type, description, date } = req.body;

    if (!amount || !categoryId || !type) {
      return res.status(400).json({
        success: false,
        message: "Amount, Type, and Category are required.",
      });
    }

    try {
      let fileUrl = null;

      // 🔥 Upload to Cloudinary if file exists
      if (req.file) {
        const result = await uploadToCloudinary(
          req.file.buffer,
          "expenseMate/receipts"
        );
        fileUrl = result.secure_url;
      }

      const newTransaction = new Transaction({
        userId,
        categoryId,
        amount,
        type,
        description,
        date: date || Date.now(),
        file: fileUrl, // ✅ Cloudinary URL saved
      });

      const transaction = await newTransaction.save();

      // Update User's lastTransactionChange
      await User.findByIdAndUpdate(userId, { lastTransactionChange: Date.now() });

      res.status(201).json({
        success: true,
        message: "Transaction added successfully",
        transaction,
      });
    } catch (error) {
      console.error("Error adding transaction:", error);
      res.status(500).json({
        success: false,
        message: "Server error. Please try again later.",
      });
    }
  });
};


// Get recent transactions for the logged-in user
export const getRecentTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("categoryId", "title");

    res.status(200).json({ success: true, transactions });
  } catch (error) {
    console.error("Error fetching recent transactions", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get all transactions for the logged-in user
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .populate("categoryId", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, transactions });
  } catch (error) {
    console.error("Error fetching transactions", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



export const downloadTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const transactions = await Transaction.find({ userId })
      .populate("categoryId", "title")
      .sort({ date: -1 });

    const doc = new PDFDocument({ size: "A4", margin: 50 });

    // Headers must be sent before piping
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=transactions.pdf");
    res.flushHeaders(); // ensures headers are sent immediately

    doc.pipe(res);

    // Title
    doc.fontSize(20).text("Transaction Report", { align: "center" });
    doc.moveDown();

    // Table headers
    const tableTop = 150;
    const dateX = 50, typeX = 150, categoryX = 250, descX = 350, amountX = 500;

    doc.fontSize(12)
      .text("Date", dateX, tableTop)
      .text("Type", typeX, tableTop)
      .text("Category", categoryX, tableTop)
      .text("Description", descX, tableTop)
      .text("Amount", amountX, tableTop);

    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    let yPosition = tableTop + 25;

    transactions.forEach(tx => {
      if (yPosition > 700) {
        doc.addPage();
        yPosition = 50;
      }

      doc.fontSize(10)
        .text(new Date(tx.date).toLocaleDateString(), dateX, yPosition)
        .text(tx.type, typeX, yPosition)
        .text(tx.categoryId?.title || "Uncategorized", categoryX, yPosition)
        .text(tx.description || "", descX, yPosition, { width: 140, ellipsis: true })
        .text(tx.amount.toString(), amountX, yPosition);

      yPosition += 20;
    });

    doc.end();

    // Do NOT send any res.json() after piping
  } catch (error) {
    console.error("PDF export error:", error);

    // Only send error if headers not sent
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to export transactions" });
    }
  }
};


// update transaction
export const updateTransactions = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || err,
      });
    }

    try {
      const { id } = req.params;
      const { categoryId, amount, type, description, date } = req.body;

      let updateData = {
        categoryId,
        amount,
        type,
        description,
        date
      };

      if (req.file) {
        const result = await uploadToCloudinary(
          req.file.buffer,
          "expenseMate/receipts"
        );
        updateData.file = result.secure_url;
      } else {
        console.log("No file received in update.");
      }

      const transaction = await Transaction.findByIdAndUpdate(id, updateData, { new: true }).populate("categoryId", "title");

      // Update User's lastTransactionChange
      if (transaction) {
        await User.findByIdAndUpdate(req.user._id, { lastTransactionChange: Date.now() });
      }

      res.status(200).json({ success: true, message: "Transaction updated successfully", transaction });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Transaction updated failed", error });
    }
  });
}

// remove transaction
export const removeTransactions = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const transaction = await Transaction.findByIdAndDelete(id);

    // Update User's lastTransactionChange
    if (transaction) {
      await User.findByIdAndUpdate(req.user._id, { lastTransactionChange: Date.now() });
    }

    res.status(200).json({ success: true, message: "Transaction removed successfully", transaction });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Transaction removed failed", error });
  }
}

// remove many transactions
export const removeManyTransactions = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: "No transaction IDs provided" });
    }

    const result = await Transaction.deleteMany({
      _id: { $in: ids },
      userId: req.user._id // Ensure user can only delete their own transactions
    });

    // Update User's lastTransactionChange
    if (result.deletedCount > 0) {
      await User.findByIdAndUpdate(req.user._id, { lastTransactionChange: Date.now() });
    }

    res.status(200).json({ success: true, message: "Transactions deleted successfully", count: result.deletedCount });
  } catch (error) {
    console.error("Bulk delete error:", error);
    res.status(500).json({ success: false, message: "Bulk delete failed", error });
  }
}

// Get transactions by specific date
export const getTransactionsByDate = async (req, res) => {
  try {
    const { date } = req.body;
    const userId = req.user._id;

    if (!date) {
      return res.status(400).json({ success: false, message: "Date is required" });
    }

    console.log("Received Date Query:", date);

    // Construct Date objects for the start and end of that specific calendar day in UTC
    const queryDate = new Date(date);
    const year = queryDate.getFullYear();
    const month = queryDate.getMonth();
    const day = queryDate.getDate();

    const startOfDay = new Date(year, month, day, 0, 0, 0, 0);
    const endOfDay = new Date(year, month, day, 23, 59, 59, 999);

    const transactions = await Transaction.find({
      userId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).populate("categoryId", "title").sort({ date: -1 });

    console.log("Found transactions:", transactions.length);

    const totalAmount = transactions.reduce((acc, curr) => acc + curr.amount, 0);

    res.status(200).json({ success: true, transactions, totalAmount });
  } catch (error) {
    console.error("Error fetching transactions by date:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



