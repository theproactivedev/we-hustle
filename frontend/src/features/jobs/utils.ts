import type { JobSearch, JobType } from "./types";

const jobTypes = ["Full-time", "Contract", "Part-time"] as const;

const isJobType = (value: unknown): value is JobType =>
  typeof value === "string" && jobTypes.some((jobType) => jobType === value);

function validateJobSearch(search: Record<string, unknown>): JobSearch {
  const query = typeof search.q === "string" ? search.q.trim() : "";
  const jobType = isJobType(search.jobType) ? search.jobType : undefined;
  const rawRate = search.minHourlyRate;
  const minHourlyRate =
    typeof rawRate === "number"
      ? rawRate
      : typeof rawRate === "string" && rawRate.trim()
        ? Number(rawRate)
        : undefined;

  return {
    ...(query ? { q: query } : {}),
    ...(jobType ? { jobType } : {}),
    ...(minHourlyRate !== undefined && Number.isFinite(minHourlyRate) && minHourlyRate >= 0
      ? { minHourlyRate }
      : {}),
  };
}

function getJobSearchFromForm(formData: FormData): JobSearch {
  const query = formData.get("q");
  const jobType = formData.get("jobType");
  const rawMinimumHourlyRate = formData.get("minHourlyRate");
  const minimumHourlyRate =
    typeof rawMinimumHourlyRate === "string" && rawMinimumHourlyRate.trim()
      ? Number(rawMinimumHourlyRate)
      : undefined;

  return {
    ...(typeof query === "string" && query.trim() ? { q: query.trim() } : {}),
    ...(isJobType(jobType) ? { jobType } : {}),
    ...(minimumHourlyRate !== undefined &&
    Number.isFinite(minimumHourlyRate) &&
    minimumHourlyRate >= 0
      ? { minHourlyRate: minimumHourlyRate }
      : {}),
  };
}

export { getJobSearchFromForm, jobTypes, validateJobSearch };
