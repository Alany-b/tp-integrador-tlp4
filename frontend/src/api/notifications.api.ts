import { apiClient } from "./client";
import { Subject } from "../observer/Subject";
import type { Id, Notification } from "../types";

export const notificationsChanged = new Subject<void>();

export async function listNotifications(): Promise<Notification[]> {
  return apiClient.request<Notification[]>("GET", "/notifications");
}

export async function markNotificationAsRead(id: Id): Promise<void> {
  return apiClient.request<void>("PATCH", `/notifications/${id}/read`);
}
