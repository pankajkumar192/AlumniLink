import express from "express";
import { getPosts, createPost, toggleLike, addComment } from "../controllers/postController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getPosts);
router.post("/", authMiddleware, createPost);
router.post("/:id/like", authMiddleware, toggleLike);
router.post("/:id/comments", authMiddleware, addComment);

export default router;
