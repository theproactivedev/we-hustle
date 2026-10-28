import { http } from "../../lib/http";
import type { DeleteSavedJobResponse, SavedJobResponse, SavedJobsResponse } from "./types";

async function getMySavedJobs(): Promise<SavedJobsResponse> {
  const { data } = await http.get<SavedJobsResponse>("/api/saved-jobs/mine");
  return data;
}

async function saveJob(jobId: string): Promise<SavedJobResponse> {
  const { data } = await http.post<SavedJobResponse>("/api/saved-jobs", { jobId });
  return data;
}

async function deleteSavedJob(jobId: string): Promise<DeleteSavedJobResponse> {
  const { data } = await http.delete<DeleteSavedJobResponse>(
    `/api/saved-jobs/${encodeURIComponent(jobId)}`,
  );
  return data;
}

export { deleteSavedJob, getMySavedJobs, saveJob };
