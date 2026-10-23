import type { Request, Response } from "express";

import { prisma } from "../lib/prisma.js";

const getQueryString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

const getHourlyRate = (salary: string | null): number | undefined => {
  if (!salary) return undefined;

  const amountMatch = salary.match(/\d[\d,\s]*(?:\.\d+)?/);
  if (!amountMatch) return undefined;

  const amount = Number(amountMatch[0].replace(/[,\s]/g, ""));
  if (!Number.isFinite(amount)) return undefined;

  if (/\b(?:hour|hourly|hr|hrs)\b/i.test(salary)) return amount;
  return amount / 2080;
};

const getJobs = async (req: Request, res: Response) => {
  try {
    const searchText = getQueryString(req.query.q);
    const jobType = getQueryString(req.query.jobType);
    const rawMinimumHourlyRate = getQueryString(req.query.minHourlyRate);
    const minimumHourlyRate = rawMinimumHourlyRate === undefined
      ? undefined
      : Number(rawMinimumHourlyRate);

    if (
      minimumHourlyRate !== undefined &&
      (!Number.isFinite(minimumHourlyRate) || minimumHourlyRate < 0)
    ) {
      return res.status(400).json({ message: "Minimum hourly rate must be a non-negative number" });
    }

    const jobs = await prisma.job.findMany({
      where: {
        ...(jobType ? { jobType } : {}),
        ...(searchText
          ? {
            OR: [
              { title: { contains: searchText, mode: "insensitive" as const } },
              { company: { contains: searchText, mode: "insensitive" as const } },
              { location: { contains: searchText, mode: "insensitive" as const } },
              { description: { contains: searchText, mode: "insensitive" as const } },
            ],
          }
          : {}),
      },
    });
    const filteredJobs = minimumHourlyRate === undefined
      ? jobs
      : jobs.filter((job) => {
        const hourlyRate = getHourlyRate(job.salary);
        return hourlyRate !== undefined && hourlyRate >= minimumHourlyRate;
      });

    return res.status(200).json({ message: "Jobs retrieved successfully", data: filteredJobs });
  } catch (error) {
    console.error("Error retrieving jobs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getJobById = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.jobId;
    if (typeof jobId !== "string") {
      return res.status(400).json({ message: "Job ID is required" });
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: {
        id: true,
        title: true,
        company: true,
        location: true,
        jobType: true,
        description: true,
        salary: true,
        postedAt: true,
      },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const applicationCount = await prisma.application.count({
      where: { jobId },
    });

    return res.status(200).json({
      data: {
        ...job,
        applicationCount,
      },
    });
  } catch (error) {
    console.error("Error retrieving job:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const createJob = async (req: Request, res: Response) => {
  try {
    const { title, description, company, location, jobType, salary, postedById } = req.body;

    if(!title || !description || !company || !location || !jobType || !postedById) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newJob = await prisma.job.create({
      data: {
        title,
        description,
        company,
        location,
        jobType,
        salary,
        postedById,
      },
      include: {
        postedBy: true,
      },
    });

    return res.status(201).json({ message: "Job created successfully", job: newJob });

  } catch(error) {
    console.error("Error creating job:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createJob,
  getJobById,
  getJobs};
