import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { submitApplication } from "./api";

function getApplicationErrorMessage(error: unknown): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? "We couldn't submit your application. Please try again.";
  }

  return "We couldn't submit your application. Please try again.";
}

export function useSubmitApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => submitApplication(jobId),
    onSuccess: async (_response, jobId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["jobs"] }),
        queryClient.invalidateQueries({ queryKey: ["job", jobId] }),
        queryClient.invalidateQueries({ queryKey: ["applications", "mine"] }),
      ]);
    },
  });
}

export { getApplicationErrorMessage };
