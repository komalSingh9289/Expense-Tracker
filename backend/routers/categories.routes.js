import e from "express";
import { addCategory, getCatByType, getCategories, updateCat, deleteCategory } from "../controllers/categroy.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = e.Router();

router.use(protect); // All category routes require authentication

router.post("/", addCategory);
router.get("/", getCategories);
router.put("/:id", updateCat);
router.delete("/:id", deleteCategory);
router.get("/:type", getCatByType);

export default router;