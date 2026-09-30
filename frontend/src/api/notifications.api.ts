import { request } from "./client";
import type { Id, Notification } from "../types";

export async function listNotifications(): Promise<Notification[]> {
  return request<Notification[]>("GET", "/notifications");
}

export async function markNotificationAsRead(id: Id): Promise<Notification> {
  return request<Notification>("PATCH", `/notifications/${id}/read`);
}
