import { queryOptions, useQuery } from "@tanstack/react-query";
import { getJobById, getJobs } from "./api";
import type { JobSearch } from "./types";

const jobsQueryOptions = (search: JobSearch) =>
  queryOptions({
    queryKey: ["jobs", search] as const,
    queryFn: () => getJobs(search),
  });

const jobSingleQueryOptions = (jobId: string) =>
  queryOptions({
    queryKey: ["job", jobId] as const,
    queryFn: () => getJobById(jobId),
  });

function useJobs(search: JobSearch) {
  return useQuery(jobsQueryOptions(search));
}

function useJob(jobId: string) {
  return useQuery(jobSingleQueryOptions(jobId));
}

export { jobSingleQueryOptions, jobsQueryOptions, useJob, useJobs };