import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { deleteSavedJob, saveJob } from "./api";

type ToggleSavedJobInput = {
  jobId: string;
  isSaved: boolean;
};

function getSavedJobErrorMessage(error: unknown): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? "We couldn't update your saved jobs. Please try again.";
  }

  return "We couldn't update your saved jobs. Please try again.";
}

export function useToggleSavedJob(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, isSaved }: ToggleSavedJobInput) =>
      isSaved ? deleteSavedJob(jobId) : saveJob(jobId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["saved-jobs", "mine", userId] });
    },
  });
}

export { getSavedJobErrorMessage };
