import express from "express";
import { getEvents, createEvent, getEventById, registerEvent } from "../controllers/eventController.js";
import { authMiddleware, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getEvents).post(authMiddleware, authorize("alumni", "admin"), createEvent);
router.route("/:id").get(getEventById);
router.route("/:id/register").post(authMiddleware, registerEvent);

export default router;
