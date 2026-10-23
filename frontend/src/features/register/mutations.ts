import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { register } from "./api";
import { registerQueryKeys } from "./queries";
import type { RegisterPayload } from "./types";

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: registerQueryKeys.all,
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: () => {
      void navigate({ to: "/jobs" });
    },
  });
}
