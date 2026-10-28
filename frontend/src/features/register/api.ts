import { http } from "../../lib/http";
import type { RegisterPayload, RegisterResponse } from "./types";

async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const { data } = await http.post<RegisterResponse>("/api/auth/register", payload);
  return data;
}

export { register };
