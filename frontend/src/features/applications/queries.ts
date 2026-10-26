import { useQuery } from "@tanstack/react-query";
import { getMyApplications } from "./api";

export function useMyApplications(userId: string | undefined) {
  return useQuery({
    queryKey: ["applications", "mine", userId],
    queryFn: getMyApplications,
    enabled: Boolean(userId),
  });
}
