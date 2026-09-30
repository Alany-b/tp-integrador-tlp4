export type Id = number | string;

export type Role = "admin" | "operador" | "usuario";

export type Permission =
  | "ticket:read"
  | "ticket:create"
  | "ticket:update"
  | "ticket:change-status"
  | "ticket:delete"
  | "subscription:create"
  | "subscription:delete"
  | "notification:read"
  | "user:read"
  | "user:assign-role";

export type TicketStatus = "ABIERTO" | "EN_PROGRESO" | "RESUELTO" | "CERRADO";

export const TICKET_STATUSES: TicketStatus[] = ["ABIERTO", "EN_PROGRESO", "RESUELTO", "CERRADO"];

export const ROLES: Role[] = ["admin", "operador", "usuario"];

export interface User {
  id: Id;
  email: string;
  role: Role;
  permissions: Permission[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Ticket {
  id: Id;
  title: string;
  description: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TicketDetail extends Ticket {
  isSubscribed: boolean;
}

export interface Subscription {
  id: Id;
  userId: Id;
  ticketId: Id;
  createdAt: string;
}

export interface Notification {
  id: Id;
  ticketId: Id;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface RegisterBody {
  email: string;
  password: string;
}

export interface TicketBody {
  title: string;
  description: string;
}

export interface TicketStatusBody {
  status: TicketStatus;
}

export interface UserRoleBody {
  role: Role;
}
