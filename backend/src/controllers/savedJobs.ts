import type { Request, Response } from "express";

import { prisma } from "../lib/prisma.js";

const isUniqueConstraintError = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  error.code === "P2002";

const getMySavedJobs = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "You must be signed in to view saved jobs" });
  }

  try {
    const savedJobs = await prisma.savedJobs.findMany({
      where: { userId },
      select: { jobId: true },
    });

    return res.status(200).json({
      message: "Saved jobs loaded successfully",
      data: { jobIds: savedJobs.map((savedJob) => savedJob.jobId) },
    });
  } catch (error) {
    console.error("Error loading saved jobs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const createSavedJob = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const rawJobId = req.body?.jobId;

  if (!userId) {
    return res.status(401).json({ message: "You must be signed in to save jobs" });
  }
  if (typeof rawJobId !== "string" || !rawJobId.trim()) {
    return res.status(400).json({ message: "A job ID is required" });
  }

  const jobId = rawJobId.trim();

  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { id: true },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const savedJob = await prisma.savedJobs.create({
      data: { jobId: job.id, userId },
    });

    return res.status(201).json({
      message: "Job saved successfully",
      data: savedJob,
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return res.status(409).json({ message: "You have already saved this job" });
    }

    console.error("Error saving job:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteSavedJob = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const rawJobId = req.params.jobId;
  const jobId = typeof rawJobId === "string" ? rawJobId.trim() : "";

  if (!userId) {
    return res.status(401).json({ message: "You must be signed in to remove saved jobs" });
  }
  if (!jobId) {
    return res.status(400).json({ message: "A job ID is required" });
  }

  try {
    const result = await prisma.savedJobs.deleteMany({
      where: { jobId, userId },
    });

    if (result.count === 0) {
      return res.status(404).json({ message: "Saved job not found" });
    }

    return res.status(200).json({ message: "Job removed from saved jobs" });
  } catch (error) {
    console.error("Error removing saved job:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { createSavedJob, deleteSavedJob, getMySavedJobs };
