import { apiClient } from "./client";
import type { AuthResponse, LoginBody, RegisterBody } from "../types";

export async function login(body: LoginBody): Promise<AuthResponse> {
  return apiClient.request<AuthResponse>("POST", "/auth/login", body);
}

export async function register(body: RegisterBody): Promise<AuthResponse> {
  return apiClient.request<AuthResponse>("POST", "/auth/register", body);
}
