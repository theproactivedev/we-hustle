import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "./api";

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