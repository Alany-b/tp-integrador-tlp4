import { apiClient } from "./client";
import type { Id, User, UserRoleBody } from "../types";

export async function listUsers(): Promise<User[]> {
  return apiClient.request<User[]>("GET", "/users");
}

export async function assignUserRole(id: Id, body: UserRoleBody): Promise<User> {
  return apiClient.request<User>("PATCH", `/users/${id}/role`, body);
}
