import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  AUTH_TOKEN_CHANGED_EVENT,
  AUTH_TOKEN_STORAGE_KEY,
  clearAuthToken,
  getAuthToken,
  getTokenExpirationTime,
} from "./token";

const MAX_TIMEOUT = 2_147_483_647;

export default function AuthExpirationHandler() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const handledTokenRef = useRef<string | null>(null);

  useEffect(() => {
    let expirationTimer: number | undefined;
    let isDisposed = false;

    const clearExpirationTimer = () => {
      if (expirationTimer !== undefined) {
        window.clearTimeout(expirationTimer);
        expirationTimer = undefined;
      }
    };

    const expireToken = async (token: string) => {
      if (isDisposed || getAuthToken() !== token || handledTokenRef.current === token) {
        return;
      }

      handledTokenRef.current = token;
      clearAuthToken();
      await queryClient.cancelQueries();
      queryClient.clear();
      await navigate({ to: "/sign-in", replace: true });
    };

    const scheduleExpiration = () => {
      clearExpirationTimer();

      const token = getAuthToken();
      if (handledTokenRef.current !== token) {
        handledTokenRef.current = null;
      }
      if (!token) {
        return;
      }

      const expirationTime = getTokenExpirationTime(token);
      if (expirationTime === null || expirationTime <= Date.now()) {
        void expireToken(token);
        return;
      }

      const remainingTime = expirationTime - Date.now();
      expirationTimer = window.setTimeout(() => {
        if (expirationTime <= Date.now()) {
          void expireToken(token);
        } else {
          scheduleExpiration();
        }
      }, Math.min(remainingTime, MAX_TIMEOUT));
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === AUTH_TOKEN_STORAGE_KEY) {
        scheduleExpiration();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        scheduleExpiration();
      }
    };

    scheduleExpiration();
    window.addEventListener(AUTH_TOKEN_CHANGED_EVENT, scheduleExpiration);
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", scheduleExpiration);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isDisposed = true;
      clearExpirationTimer();
      window.removeEventListener(AUTH_TOKEN_CHANGED_EVENT, scheduleExpiration);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", scheduleExpiration);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [navigate, queryClient]);

  return null;
}
