import { SESSION_USER_KEY, SESSION_TOKEN_KEY } from "./sessionKeys";

export const SESSION_EXPIRES_KEY = "payhub_session_expires_at";
export const SESSION_DURATION_MS = 60 * 60 * 1000;


export function isSessionExpired(): boolean {
  const saved = window.localStorage.getItem(SESSION_EXPIRES_KEY);
  if (!saved) return false;
  return Number(saved) < Date.now();
}

export function clearStoredSession() {
  window.localStorage.removeItem(SESSION_USER_KEY);
  window.localStorage.removeItem(SESSION_TOKEN_KEY);
  window.localStorage.removeItem(SESSION_EXPIRES_KEY);
}
