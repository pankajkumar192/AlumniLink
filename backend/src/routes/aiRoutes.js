import express from "express";
import { generateText, matchMentors } from "../controllers/aiController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", authMiddleware, generateText);
router.post("/match", authMiddleware, matchMentors);

export default router;
