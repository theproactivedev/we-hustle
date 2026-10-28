import { http } from "../../lib/http";
import type { JobDetailsResponse, JobSearch, JobsResponse } from "./types";

async function getJobs(filters: JobSearch): Promise<JobsResponse> {
  const params: JobSearch = {};
  if (filters.q) {
    params.q = filters.q;
  }

  if (filters.jobType) {
    params.jobType = filters.jobType;
  }
  
  if (filters.minHourlyRate !== undefined) {
    params.minHourlyRate = filters.minHourlyRate;
  }

  const { data } = await http.get<JobsResponse>("/api/jobs", { params });
  return data;
}

async function getJobById(jobId: string): Promise<JobDetailsResponse> {
  const { data } = await http.get<JobDetailsResponse>(`/api/jobs/${encodeURIComponent(jobId)}`);
  return data;
}

export { getJobById, getJobs };