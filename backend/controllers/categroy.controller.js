import Category from "../models/category.model.js";

// Helper function to calculate similarity (Levenshtein distance)
const getSimilarity = (s1, s2) => {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();
  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) costs[j] = j;
      else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
};

export const addCategory = async (req, res) => {
  const { title, sourceType } = req.body;
  const userId = req.user._id;

  if (!title || !sourceType) {
    return res.status(400).json({ success: false, message: "All fields are required!" });
  }

  if (title.length > 20) {
    return res.status(400).json({ success: false, message: "Category title must be 20 characters or less." });
  }

  try {
    // Check for exact duplicate in predefined or user's categories
    const exactMatch = await Category.findOne({
      title: { $regex: new RegExp(`^${title}$`, "i") },
      $or: [{ isPredefined: true }, { userId }],
    });

    if (exactMatch) {
      return res.status(400).json({ success: false, message: "Category already exists!" });
    }

    // Similarity Check
    const allVisibleCategories = await Category.find({
      $or: [{ isPredefined: true }, { userId }],
      sourceType
    });

    for (const cat of allVisibleCategories) {
      const distance = getSimilarity(title, cat.title);
      // If distance is small (e.g., 1 or 2 depending on length), suggest existing
      if (distance > 0 && distance <= 2) {
        return res.status(400).json({
          success: false,
          message: `Category is too similar to existing one: "${cat.title}". Please select that instead.`
        });
      }
    }

    const category = await Category.create({ title, sourceType, userId });
    return res.status(201).json({
      success: true,
      message: "Category added successfully",
      category,
    });
  } catch (error) {
    console.log("Category creation error", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const userId = req.user._id;
    const categories = await Category.find({
      $or: [{ isPredefined: true }, { userId }],
    });

    return res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      categories,
    });
  } catch (error) {
    console.log("Error fetching categories:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateCat = async (req, res) => {
  const { id } = req.params;
  const { title, sourceType } = req.body;
  const userId = req.user._id;

  if (!title || !sourceType) {
    return res.status(400).json({ success: false, message: "Title and sourceType are required." });
  }

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    if (category.isPredefined || (category.userId && category.userId.toString() !== userId.toString())) {
      return res.status(403).json({ success: false, message: "You can only update categories created by you." });
    }

    // Check for duplicate title
    const categoryExists = await Category.findOne({
      title: { $regex: new RegExp(`^${title}$`, "i") },
      $or: [{ isPredefined: true }, { userId }],
      _id: { $ne: id }
    });
    if (categoryExists) {
      return res.status(400).json({ success: false, message: "A category with this title already exists." });
    }

    category.title = title;
    category.sourceType = sourceType;
    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      category,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    if (category.isPredefined || (category.userId && category.userId.toString() !== userId.toString())) {
      return res.status(403).json({ success: false, message: "You can only delete categories created by you." });
    }

    await Category.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Category deleted successfully." });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const getCatByType = async (req, res) => {
  const { type } = req.params;
  const userId = req.user._id;

  try {
    const categories = await Category.find({
      sourceType: type,
      $or: [{ isPredefined: true }, { userId }]
    });

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Error fetching categories by type:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};
