import axios from "axios";
import type { RegisterPayload, RegisterResponse } from "./types";

async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const { data } = await axios.post<RegisterResponse>("/api/auth/register", payload);
  return data;
}

export { register };
