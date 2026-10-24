import axios from "axios";
import type { ApplicationResponse } from "./types";

async function submitApplication(jobId: string): Promise<ApplicationResponse> {
  const { data } = await axios.post<ApplicationResponse>("/api/applications", { jobId });
  return data;
}

export { submitApplication };
