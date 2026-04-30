import express from "express";
import { register, login, getMe, updateProfile, oauthLogin } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/oauth", oauthLogin);           // Google / GitHub via Firebase
router.get("/me", authMiddleware, getMe);
router.put("/profile", authMiddleware, updateProfile);

export default router;
