import {
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { getCurrentUser } from "./api";
import { getAuthToken } from "./token";

export const currentUserQueryOptions = () => {
  const hasToken = Boolean(getAuthToken());
  return queryOptions({
    queryKey: ["auth", "me"] as const,
    queryFn: getCurrentUser,
    enabled: hasToken,
    staleTime: 60_000,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useCurrentUser() {
  return useQuery(currentUserQueryOptions());
}