import express from "express";
import { getFinancialInsight } from "../controllers/aiInsight.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Rate Limit: 5 requests per hour per IP (or we can use req.user.id if we built a custom store, but IP is easier for default memory store)
// Note: standard rateLimit uses IP by default. To limit by user ID we'd need a custom keyGenerator.
// For simplicity/MVP, IP based is usually fine, or we add keyGenerator.

const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 requests per `window` (here, per hour)
    message: {
        success: false,
        message: "Too many AI requests. Please try again in an hour."
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

router.get("/insight", protect, aiLimiter, getFinancialInsight);

export default router;
