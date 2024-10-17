import mongoose from "mongoose";
import Category from "../models/category.model.js";

export const addCategory = async (req, res) => {
  const { title, sourcesourceType } = req.body;

  // Check if title is provided
  if (!title || !sourcesourceType) {
    return res
      .status(404)
      .json({ success: false, message: "All fields are required!" });
  }

  try {
    const existsCat = await Category.findOne({ title });
    if (existsCat) {
      return res
        .status(401)
        .json({ success: false, message: "Category already exists!" });
    }

    const category = await Category.create({ title, sourcesourceType });
    return res.status(201).json({
      success: true,
      message: "Category added successfully",
      category,
    });
  } catch (error) {
    console.log("Category creation error", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    if (!categories || categories.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "All fields are required!" });
    }

    return res.status(200).json({
      success: false,
      message: "Categories retrieved successfully",
      categories,
    });
  } catch (error) {
    console.log("Error fetching categories:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateCat = async (req, res) => {
  const { id } = req.params; // Get the category ID from the URL parameters
  const { title, sourceType } = req.body; // Get the updated title and sourceType from the request body

  // Validate input fields
  if (!title || !sourceType) {
    return res.status(400).json({
      success: false,
      message: "Title and sourceType are required.",
    });
  }

  // Validate 'sourceType' field (must be 'income' or 'expense')
  if (sourceType !== "Income" && sourceType !== "Expense") {
    return res.status(400).json({
      success: false,
      message: "sourceType must be either 'income' or 'expense'.",
    });
  }

  try {
    // Check if the category exists by ID
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    // Check if another category with the same title already exists
    const categoryExists = await Category.findOne({ title });
    if (categoryExists && categoryExists._id.toString() !== id) {
      return res.status(400).json({
        success: false,
        message: "A category with this title already exists.",
      });
    }

    // Update the category fields
    category.title = title;
    category.sourceType = sourceType;
    await category.save(); // Save the updated category

    return res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      category,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const getCatByType = async (req, res) => {
  const { type } = req.params; // Extract sourceType from request params

  try {
    // Fetch categories from the database where sourceType matches the parameter
    const categories = await Category.find({ sourceType: type });

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No categories found for the provided type!",
      });
    }

    // Return categories if found
    return res.status(200).json({
      success: true,
      categories,
    });

  } catch (error) {
    console.error("Error fetching categories by type:", error);
    
    // Return a 500 error if something goes wrong
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
