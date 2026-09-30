import { request } from "./client";
import type { AuthResponse, LoginBody, RegisterBody } from "../types";

const MOCK_EMAIL = "admin@tp.com";
const MOCK_PASSWORD = "admin123";

const MOCK_RESPONSE: AuthResponse = {
  token: "mock-token",
  user: {
    id: 1,
    email: MOCK_EMAIL,
    role: "admin",
    permissions: [
      "ticket:read",
      "ticket:create",
      "ticket:update",
      "ticket:change-status",
      "ticket:delete",
      "subscription:create",
      "subscription:delete",
      "notification:read",
      "user:read",
      "user:assign-role",
    ],
  },
};

export async function login(body: LoginBody): Promise<AuthResponse> {
  if (import.meta.env.DEV && body.email === MOCK_EMAIL && body.password === MOCK_PASSWORD) {
    return MOCK_RESPONSE;
  }
  return request<AuthResponse>("POST", "/auth/login", body);
}

export async function register(body: RegisterBody): Promise<void> {
  return request<void>("POST", "/auth/register", body);
}
