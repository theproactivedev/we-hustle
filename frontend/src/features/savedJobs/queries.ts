import { useQuery } from "@tanstack/react-query";
import { getMySavedJobs } from "./api";

export function useMySavedJobs(userId: string | undefined) {
  return useQuery({
    queryKey: ["saved-jobs", "mine", userId],
    queryFn: getMySavedJobs,
    enabled: Boolean(userId),
  });
}
