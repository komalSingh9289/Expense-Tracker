import multer from "multer";
import path from "path";
import Transaction from "../models/transaction.model.js";
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



// ... (existing code)

export const downloadTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const transactions = await Transaction.find({ userId })
      .populate("categoryId", "title")
      .sort({ date: -1 });

    const doc = new PDFDocument();
    
    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=transactions.pdf");

    // Pipe PDF to response
    doc.pipe(res);

    // Title
    doc.fontSize(20).text("Transaction Report", { align: "center" });
    doc.moveDown();

    // Table Headers
    const tableTop = 150;
    const dateX = 50;
    const typeX = 150;
    const categoryX = 250;
    const descX = 350; // Increased spacing
    const amountX = 500;

    doc
      .fontSize(12)
      .text("Date", dateX, tableTop)
      .text("Type", typeX, tableTop)
      .text("Category", categoryX, tableTop)
      .text("Description", descX, tableTop)
      .text("Amount", amountX, tableTop);

    doc
      .moveTo(50, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .stroke();

    let yPosition = tableTop + 25;

    transactions.forEach((tx) => {
      // Check for page break
      if (yPosition > 700) {
        doc.addPage();
        yPosition = 50;
        
        // Helper to redraw headers on new page? (Optional, keeping simple for now)
      }

      doc
          .fontSize(10)
          .text(new Date(tx.date).toLocaleDateString(), dateX, yPosition)
          .text(tx.type, typeX, yPosition)
          .text(tx.categoryId?.title || "Uncategorized", categoryX, yPosition)
          .text(tx.description || "", descX, yPosition, { width: 140, ellipsis: true }) // Limit width for description
          .text(tx.amount.toString(), amountX, yPosition);

      yPosition += 20;
    });

    doc.end();

  } catch (error) {
    console.error("PDF export error:", error);
    res.status(500).json({ message: "Failed to export transactions" });
  }
};


