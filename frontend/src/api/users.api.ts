import { request } from "./client";
import type { Id, User, UserRoleBody } from "../types";

export async function listUsers(): Promise<User[]> {
  return request<User[]>("GET", "/users");
}

export async function assignUserRole(id: Id, body: UserRoleBody): Promise<User> {
  return request<User>("PATCH", `/users/${id}/role`, body);
}
