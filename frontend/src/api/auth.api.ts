import { apiClient } from "./client";
import type { AuthResponse, LoginBody, RegisterBody } from "../types";

export async function login(body: LoginBody): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>("/auth/login", body);
}

export async function register(body: RegisterBody): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>("/auth/register", body);
}
