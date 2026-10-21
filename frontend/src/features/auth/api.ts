import axios from "axios";
import type { AuthUser } from "./types";

async function getCurrentUser(): Promise<AuthUser | null> {
  const { data } = await axios.get('api/auth/me');
  return data;
}

async function logout() {
    await axios.post('api/auth/logout');
}

export {
    getCurrentUser,
    logout
}