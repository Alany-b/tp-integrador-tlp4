export type Id = number | string;

export type Role = "admin" | "operador" | "usuario";

export type Permission =
  | "event:read"
  | "event:create"
  | "event:update"
  | "event:change-status"
  | "event:delete"
  | "subscription:create"
  | "subscription:delete"
  | "notification:read"
  | "user:read"
  | "user:assign-role";

export type EventStatus = "PROGRAMADO" | "REPROGRAMADO" | "CANCELADO" | "FINALIZADO";

export const EVENT_STATUSES: EventStatus[] = ["PROGRAMADO", "REPROGRAMADO", "CANCELADO", "FINALIZADO"];

export const ROLES: Role[] = ["admin", "operador", "usuario"];

export interface User {
  id: Id;
  name: string;
  email: string;
  role: Role;
  permissions: Permission[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Event {
  id: Id;
  title: string;
  description: string;
  eventDate: string;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EventDetail extends Event {
  isSubscribed: boolean;
}

export interface Subscription {
  id: Id;
  userId: Id;
  eventId: Id;
  createdAt: string;
}

export interface Notification {
  id: Id;
  eventId: Id;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export interface EventBody {
  title: string;
  description: string;
  eventDate: string;
}

export interface EventStatusBody {
  status: EventStatus;
}

export interface UserRoleBody {
  role: Role;
}
