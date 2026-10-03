import { apiClient } from "./client";
import type { Id, User, UserRoleBody } from "../types";

export async function listUsers(): Promise<User[]> {
  return apiClient.get<User[]>("/users");
}

export async function assignUserRole(id: Id, body: UserRoleBody): Promise<User> {
  return apiClient.patch<User>(`/users/${id}/role`, body);
}
