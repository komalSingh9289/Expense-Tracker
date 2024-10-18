import { Login, Logout, SignUp } from "../controllers/auth.controller.js"; // Ensure the path is correct
import express from "express";
import { userVerification } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", SignUp);
router.post("/login", Login);
router.post("/", userVerification);
router.post("/logout", Logout);

export default router;
