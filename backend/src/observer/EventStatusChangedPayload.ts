// Datos que viajan del Subject a los Observers cuando cambia el estado de un evento
export interface EventStatusChangedPayload {
  eventId: number;
  eventTitle: string;
  oldStatus: string; // string y no un tipo del módulo events, para no acoplar observer/ con él
  newStatus: string;
}