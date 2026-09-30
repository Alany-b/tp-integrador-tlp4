import { request } from "./client";
import type { AuthResponse, LoginBody, RegisterBody } from "../types";

export async function login(body: LoginBody): Promise<AuthResponse> {
  return request<AuthResponse>("POST", "/auth/login", body);
}

export async function register(body: RegisterBody): Promise<void> {
  return request<void>("POST", "/auth/register", body);
}
