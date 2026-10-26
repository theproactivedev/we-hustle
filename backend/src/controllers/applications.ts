import type { Request, Response } from "express";

import { prisma } from "../lib/prisma.js";

const isUniqueConstraintError = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  error.code === "P2002";

const getMyApplications = async (req: Request, res: Response) => {
  const applicantId = req.user?.id;

  if (!applicantId) {
    return res.status(401).json({ message: "You must be signed in to view your applications" });
  }

  try {
    const applications = await prisma.application.findMany({
      where: { applicantId },
      select: { jobId: true },
    });

    return res.status(200).json({
      message: "Applications loaded successfully",
      data: { jobIds: applications.map((application) => application.jobId) },
    });
  } catch (error) {
    console.error("Error loading applications:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const createApplication = async (req: Request, res: Response) => {
  const jobId = req.body?.jobId;
  const applicantId = req.user?.id;

  if (!applicantId) {
    return res.status(401).json({ message: "You must be signed in to apply" });
  }
  if (typeof jobId !== "string" || !jobId.trim()) {
    return res.status(400).json({ message: "A job ID is required" });
  }

  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId.trim() },
      select: { id: true },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const application = await prisma.application.create({
      data: {
        jobId: job.id,
        applicantId,
      },
    });

    return res.status(201).json({
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return res.status(409).json({ message: "You have already applied to this job" });
    }

    console.error("Error creating application:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { createApplication, getMyApplications };
