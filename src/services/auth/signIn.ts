import { authService } from "../api/authService";
import { setApiAccessToken } from "../api";
import { setAuthenticatedUser, type User } from "../../store/authSlice";
import { SESSION_TOKEN_KEY, SESSION_USER_KEY } from "../../config/sessionKeys";
import {
  SESSION_EXPIRES_KEY,
  SESSION_DURATION_MS,
} from "../../config/sessionExpiry";
import type { AppDispatch } from "../../store";

export async function signIn(
  email: string,
  password: string,
  dispatch: AppDispatch,
) {

  const res = await authService.login(email, password);

  const token = res.accessToken ?? res.token ?? "";
  const name = res.user?.name ?? email;

  // build the user object that authSlice expects
  const user: User = {
    employeeId: res.user?.id ?? "",
    name,
    email: res.user?.email ?? email,
    role: res.user?.role ?? "merchant",
    initials: name
      .split(" ")
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join(""),
    userType: "fulltime",
  };


  window.localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
  window.localStorage.setItem(SESSION_TOKEN_KEY, token);
  window.localStorage.setItem(
    SESSION_EXPIRES_KEY,
    String(Date.now() + SESSION_DURATION_MS),
  );

  setApiAccessToken(token);
  dispatch(setAuthenticatedUser(user));
}
