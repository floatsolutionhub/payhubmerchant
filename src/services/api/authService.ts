import { apiClient } from "./httpClient";

export interface LoginResponse {
  token?: string;
  accessToken?: string;
  user?: { id?: string; name?: string; email?: string; role?: string };
}

const USE_DUMMY_LOGIN = true;

function nameFromEmail(email: string) {
  return email
    .split("@")[0]
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    if (USE_DUMMY_LOGIN) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return {
        accessToken: "dummy-token-" + Date.now(),
        user: {
          id: "EMP-1002",
          name: nameFromEmail(email),
          email,
          role: "merchant",
        },
      };
    }

    return apiClient.post<LoginResponse>("/api/v1/auth/login", {
      email,
      password,
    });
  },
};
