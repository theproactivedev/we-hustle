import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { AuthRedirect } from "../auth/types";
import { register } from "./api";
import { registerQueryKeys } from "./queries";
import type { RegisterPayload } from "./types";

export function useRegister(redirect?: AuthRedirect) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: registerQueryKeys.all,
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: ({ data }) => {
      queryClient.setQueryData(["auth", "me"], data.user);
      if (redirect) {
        void navigate({ to: "/jobs/$jobId", params: { jobId: redirect.jobId } });
      } else {
        void navigate({ to: "/jobs" });
      }
    },
  });
}
