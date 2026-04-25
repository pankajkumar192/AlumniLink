import express from "express";
import { getMentors, getMentorById, updateMentorProfile, createMentor } from "../controllers/mentorController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getMentors);
router.get("/:id", getMentorById);
router.post("/", authMiddleware, createMentor);
router.put("/profile", authMiddleware, updateMentorProfile);

export default router;
