import { INotifier } from './INotifier';

export class ConsoleNotifierAdapter implements INotifier {
  async send(message: string, _eventId?: number): Promise<void> {
    console.log(`[NOTIFICACIÓN] ${message}`);
  }
}