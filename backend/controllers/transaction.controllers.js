import multer from "multer";
import path from "path";
import Transaction from "../models/transaction.model.js";

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Upload folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Save file with unique timestamp
  },
});

// Initialize multer with defined storage and file limits
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Max file size 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/; // Acceptable file types
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Only images and PDFs are allowed!");
    }
  },
}).single("file"); // 'file' is the field name in the form

// Add transaction with optional file upload
export const addTransaction = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err,
      });
    }

    const { userId, categoryId, amount, type, description, date } = req.body;

    // Validate required fields
    if (!amount || !categoryId || !type) {
      return res.status(400).json({
        success: false,
        message: "Amount, Type, and Category are required.",
      });
    }

    try {
      // Create a new transaction
      const newTransaction = new Transaction({
        userId,
        categoryId,
        amount,
        type,
        description,
        date: date || Date.now(), // Use current date if not provided
        file: req.file ? req.file.path : null, // Optional file path
      });

      // Save transaction to the database
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

// Get recent transactions (limit 5, sorted by creation date)
export const getRecentTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
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

// Get all transactions with category details
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
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
