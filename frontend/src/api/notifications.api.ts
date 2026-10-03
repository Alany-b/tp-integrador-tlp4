import { apiClient } from "./client";
import { Subject } from "../observer/Subject";
import type { Observer } from "../observer/Subject";
import type { Id, Notification } from "../types";

const notificationsChanged = new Subject<void>();

export function onNotificationsChanged(observer: Observer<void>): () => void {
  return notificationsChanged.subscribe(observer);
}

export async function listNotifications(): Promise<Notification[]> {
  return apiClient.get<Notification[]>("/notifications");
}

export async function markNotificationAsRead(id: Id): Promise<void> {
  await apiClient.patch<void>(`/notifications/${id}/read`);
  notificationsChanged.notify();
}

export async function markAllNotificationsAsRead(ids: Id[]): Promise<void> {
  await Promise.all(ids.map((id) => apiClient.patch<void>(`/notifications/${id}/read`)));
  notificationsChanged.notify();
}
