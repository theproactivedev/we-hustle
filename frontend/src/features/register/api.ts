import { http } from "../../lib/http";
import { setAuthToken } from "../auth/token";
import type { RegisterPayload, RegisterResponse } from "./types";

async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const { data } = await http.post<RegisterResponse>("/api/auth/register", payload);
  setAuthToken(data.data.token);
  return data;
}

export { register };
