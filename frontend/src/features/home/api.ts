import type { Job } from "../../dataTypes";
import { http } from "../../lib/http";

const fetchJobs = async(): Promise<{ data: Job[] }> => {
  const res = await http.get("/api/jobs");
  return res.data;
}

export {
    fetchJobs
}