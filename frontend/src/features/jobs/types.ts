import type { Job } from "../../dataTypes";

type JobType = "Full-time" | "Contract" | "Part-time";

type JobSearch = {
  q?: string;
  jobType?: JobType;
  minHourlyRate?: number;
};

type JobsResponse = {
  data: Job[];
};

type JobDetails = Pick<
  Job,
  "id" | "title" | "company" | "location" | "jobType" | "description" | "salary" | "postedAt"
> & {
  applicationCount: number;
};

type JobDetailsResponse = {
  data: JobDetails;
};

type JobsPageProps = {
  search: JobSearch;
  onSearchChange: (search: JobSearch) => void;
};

type JobSinglePageProps = {
  jobId: string;
};

export type { JobSearch, JobType, JobsResponse, JobDetails, JobDetailsResponse, JobsPageProps, JobSinglePageProps };