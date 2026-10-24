import express from "express";

import { createApplication } from "../controllers/applications.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createApplication);

export default router;
