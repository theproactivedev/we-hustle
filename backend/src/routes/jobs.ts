import express from "express";

import { createJob, getJobById, getJobs } from "../controllers/jobs.js";

const router = express.Router();

router.post("/new", createJob);

router.get("/", getJobs);
router.get("/:jobId", getJobById);

export default router;
