import express from "express";

import { createSavedJob, deleteSavedJob, getMySavedJobs } from "../controllers/savedJobs.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/mine", authMiddleware, getMySavedJobs);
router.post("/", authMiddleware, createSavedJob);
router.delete("/:jobId", authMiddleware, deleteSavedJob);

export default router;
