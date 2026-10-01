import { request } from "./client";
import type { Id, Subscription, Event, EventBody, EventDetail, EventStatusBody } from "../types";

export async function listEvents(): Promise<Event[]> {
  return request<Event[]>("GET", "/events");
}

export async function getEvent(id: Id): Promise<EventDetail> {
  return request<EventDetail>("GET", `/events/${id}`);
}

export async function createEvent(body: EventBody): Promise<Event> {
  return request<Event>("POST", "/events", body);
}

export async function updateEvent(id: Id, body: EventBody): Promise<Event> {
  return request<Event>("PUT", `/events/${id}`, body);
}

export async function changeEventStatus(id: Id, body: EventStatusBody): Promise<Event> {
  return request<Event>("PATCH", `/events/${id}/status`, body);
}

export async function deleteEvent(id: Id): Promise<void> {
  return request<void>("DELETE", `/events/${id}`);
}

export async function subscribeToEvent(id: Id): Promise<Subscription> {
  return request<Subscription>("POST", `/events/${id}/subscription`);
}

export async function unsubscribeFromEvent(id: Id): Promise<void> {
  return request<void>("DELETE", `/events/${id}/subscription`);
}
