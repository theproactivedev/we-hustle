import axios from "axios";
import type { AuthUser, SignInPayload, SignInResponse } from "./types";

async function getCurrentUser(): Promise<AuthUser | null> {
  const { data } = await axios.get<{ message: string, data: { user: AuthUser } }>('api/auth/me');
  return data.data.user;
}

async function signIn(payload: SignInPayload): Promise<SignInResponse> {
  const { data } = await axios.post<SignInResponse>("/api/auth/login", payload);
  return data;
}

async function logout() {
  await axios.post('/api/auth/logout');
}

export {
    getCurrentUser,
    signIn,
    logout
}