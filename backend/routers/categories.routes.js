
import e from "express";
import { addCategory, getCatByType, getCategories, updateCat } from "../controllers/categroy.controller.js";

const router = e.Router();

router.post("/", addCategory );
router.get("/", getCategories);
router.put("/:id", updateCat);
router.get("/:type", getCatByType);

export default router;