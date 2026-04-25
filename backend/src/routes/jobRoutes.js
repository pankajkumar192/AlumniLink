import express from "express";
import { getJobs, createJob, getJobById, applyJob, updateApplicationStatus } from "../controllers/jobController.js";
import { authMiddleware, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getJobs).post(authMiddleware, authorize("alumni", "admin"), createJob);
router.route("/:id").get(getJobById);
router.route("/:id/apply").post(authMiddleware, applyJob);
router.route("/:jobId/applications/:userId/status").put(authMiddleware, updateApplicationStatus);

export default router;
