export const AUTH_TOKEN_STORAGE_KEY = "token";
export const AUTH_TOKEN_CHANGED_EVENT = "auth-token-changed";

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  window.dispatchEvent(new Event(AUTH_TOKEN_CHANGED_EVENT));
}

export function clearAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  window.dispatchEvent(new Event(AUTH_TOKEN_CHANGED_EVENT));
}

export function getTokenExpirationTime(token: string): number | null {
  const encodedPayload = token.split(".")[1];
  if (!encodedPayload) {
    return null;
  }

  try {
    const base64Payload = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = base64Payload.padEnd(Math.ceil(base64Payload.length / 4) * 4, "=");
    const binaryPayload = atob(paddedPayload);
    const payloadBytes = Uint8Array.from(binaryPayload, (character) => character.charCodeAt(0));
    const payload: unknown = JSON.parse(new TextDecoder().decode(payloadBytes));

    if (typeof payload !== "object" || payload === null || !("exp" in payload)) {
      return null;
    }

    const expirationSeconds = payload.exp;
    if (typeof expirationSeconds !== "number" || !Number.isFinite(expirationSeconds)) {
      return null;
    }

    const expirationTime = expirationSeconds * 1000;
    return Number.isFinite(expirationTime) ? expirationTime : null;
  } catch {
    return null;
  }
}
