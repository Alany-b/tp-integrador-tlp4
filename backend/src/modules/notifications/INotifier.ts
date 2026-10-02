export interface INotifier {
  send(message: string, eventId?: number): Promise<void>;
}