import {
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { getCurrentUser } from "./api";

export const currentUserQueryOptions = queryOptions({
  queryKey: ["auth", "me"] as const,
  queryFn: getCurrentUser,
  staleTime: 60_000,
  retry: false,
  refetchOnWindowFocus: false,
});

export function useCurrentUser() {
  return useQuery(currentUserQueryOptions);
}