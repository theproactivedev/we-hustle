import axios from "axios";
import type { DeleteSavedJobResponse, SavedJobResponse, SavedJobsResponse } from "./types";

async function getMySavedJobs(): Promise<SavedJobsResponse> {
  const { data } = await axios.get<SavedJobsResponse>("/api/saved-jobs/mine");
  return data;
}

async function saveJob(jobId: string): Promise<SavedJobResponse> {
  const { data } = await axios.post<SavedJobResponse>("/api/saved-jobs", { jobId });
  return data;
}

async function deleteSavedJob(jobId: string): Promise<DeleteSavedJobResponse> {
  const { data } = await axios.delete<DeleteSavedJobResponse>(
    `/api/saved-jobs/${encodeURIComponent(jobId)}`,
  );
  return data;
}

export { deleteSavedJob, getMySavedJobs, saveJob };
