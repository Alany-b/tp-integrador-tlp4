import { request } from "./client";
import type { Id, Subscription, Ticket, TicketBody, TicketDetail, TicketStatusBody } from "../types";

export async function listTickets(): Promise<Ticket[]> {
  return request<Ticket[]>("GET", "/tickets");
}

export async function getTicket(id: Id): Promise<TicketDetail> {
  return request<TicketDetail>("GET", `/tickets/${id}`);
}

export async function createTicket(body: TicketBody): Promise<Ticket> {
  return request<Ticket>("POST", "/tickets", body);
}

export async function updateTicket(id: Id, body: TicketBody): Promise<Ticket> {
  return request<Ticket>("PUT", `/tickets/${id}`, body);
}

export async function changeTicketStatus(id: Id, body: TicketStatusBody): Promise<Ticket> {
  return request<Ticket>("PATCH", `/tickets/${id}/status`, body);
}

export async function deleteTicket(id: Id): Promise<void> {
  return request<void>("DELETE", `/tickets/${id}`);
}

export async function subscribeToTicket(id: Id): Promise<Subscription> {
  return request<Subscription>("POST", `/tickets/${id}/subscription`);
}

export async function unsubscribeFromTicket(id: Id): Promise<void> {
  return request<void>("DELETE", `/tickets/${id}/subscription`);
}
