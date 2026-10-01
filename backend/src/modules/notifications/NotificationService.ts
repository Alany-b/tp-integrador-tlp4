import { IObserver } from '../../observer/IObserver';
import { EventStatusChangedPayload } from '../../observer/EventStatusChangedPayload';

export interface NotifierFactory {
  create(channel: string): { send(message: string): Promise<void> };
}

export class NotificationService implements IObserver {
  constructor(private readonly factory: NotifierFactory) {}

  async update(payload: EventStatusChangedPayload): Promise<void> {
    const message = `Evento #${payload.eventId} (${payload.eventTitle}) cambió: ${payload.oldStatus} -> ${payload.newStatus}`;

    // 1. Canal consola vía Adapter
    const consoleNotifier = this.factory.create('console');
    await consoleNotifier.send(message);

    // 2. Canal in-app para la base de datos
    const inAppNotifier = this.factory.create('inapp');
    await inAppNotifier.send(message);
  }
}