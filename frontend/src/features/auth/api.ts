import { http } from "../../lib/http";
import type { AuthUser, SignInPayload, SignInResponse } from "./types";

async function getCurrentUser(): Promise<AuthUser | null> {
  const { data } = await http.get<{ message: string, data: { user: AuthUser } }>('/api/auth/me');
  return data.data.user;
}

async function signIn(payload: SignInPayload): Promise<SignInResponse> {
  const { data } = await http.post<SignInResponse>("/api/auth/login", payload);
  localStorage.setItem("token", data.data.token);
  return data;
}

async function logout() {
  await http.post('/api/auth/logout');
  localStorage.removeItem("token");
}

export {
    getCurrentUser,
    signIn,
    logout
}