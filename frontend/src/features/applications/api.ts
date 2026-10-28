import { http } from "../../lib/http";
import type { ApplicationResponse, MyApplicationsResponse } from "./types";

async function submitApplication(jobId: string): Promise<ApplicationResponse> {
  const { data } = await http.post<ApplicationResponse>("/api/applications", { jobId });
  return data;
}

async function getMyApplications(): Promise<MyApplicationsResponse> {
  const { data } = await http.get<MyApplicationsResponse>("/api/applications/mine");
  return data;
}

export { getMyApplications, submitApplication };
