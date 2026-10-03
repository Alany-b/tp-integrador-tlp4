import { apiClient } from "./client";
import type { Id, Subscription, Event, EventBody, EventDetail, EventStatusBody } from "../types";

export async function listEvents(): Promise<Event[]> {
  return apiClient.get<Event[]>("/events");
}

export async function getEvent(id: Id): Promise<EventDetail> {
  return apiClient.get<EventDetail>(`/events/${id}`);
}

export async function createEvent(body: EventBody): Promise<Event> {
  return apiClient.post<Event>("/events", body);
}

export async function updateEvent(id: Id, body: EventBody): Promise<Event> {
  return apiClient.put<Event>(`/events/${id}`, body);
}

export async function changeEventStatus(id: Id, body: EventStatusBody): Promise<Event> {
  return apiClient.patch<Event>(`/events/${id}/status`, body);
}

export async function deleteEvent(id: Id): Promise<void> {
  return apiClient.delete<void>(`/events/${id}`);
}

export async function subscribeToEvent(id: Id): Promise<Subscription> {
  return apiClient.post<Subscription>(`/events/${id}/subscription`);
}

export async function unsubscribeFromEvent(id: Id): Promise<void> {
  return apiClient.delete<void>(`/events/${id}/subscription`);
}
