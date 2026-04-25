import express from "express";
import {
  createMentorshipRequest,
  getMentorshipRequests,
  updateMentorshipRequest,
} from "../controllers/mentorshipController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createMentorshipRequest);
router.get("/", authMiddleware, getMentorshipRequests);
router.put("/:id", authMiddleware, updateMentorshipRequest);

export default router;
