import axios from "axios";
import type { ApplicationResponse, MyApplicationsResponse } from "./types";

async function submitApplication(jobId: string): Promise<ApplicationResponse> {
  const { data } = await axios.post<ApplicationResponse>("/api/applications", { jobId });
  return data;
}

async function getMyApplications(): Promise<MyApplicationsResponse> {
  const { data } = await axios.get<MyApplicationsResponse>("/api/applications/mine");
  return data;
}

export { getMyApplications, submitApplication };
