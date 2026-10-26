import express from "express";

import { createApplication, getMyApplications } from "../controllers/applications.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/mine", authMiddleware, getMyApplications);
router.post("/", authMiddleware, createApplication);

export default router;
