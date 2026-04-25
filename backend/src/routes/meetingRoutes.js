import express from "express";
import { getMeetings, createMeeting } from "../controllers/meetingController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getMeetings);
router.post("/", authMiddleware, createMeeting);

export default router;
