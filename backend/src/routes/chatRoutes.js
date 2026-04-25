import express from "express";
import { getConversations, getMessages, createOrGetConversation } from "../controllers/chatController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/conversations", getConversations);
router.post("/conversations", createOrGetConversation);
router.get("/conversations/:id/messages", getMessages);

export default router;
