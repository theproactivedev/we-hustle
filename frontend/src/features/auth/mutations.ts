import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout, signIn } from "./api";
import type { SignInPayload } from "./types";
import { useNavigate } from "@tanstack/react-router";

export function useSignIn() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: SignInPayload) => signIn(payload),
    onSuccess: ({ data }) => {
      queryClient.setQueryData(["auth", "me"], data.user);
      void navigate({ to: "/jobs" });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,

    onSuccess: async () => {
      // Update authentication state immediately.
      queryClient.setQueryData(["auth", "me"], null);

      // Remove cached private data.
      await queryClient.cancelQueries();
    },
  });
}