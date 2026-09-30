import { INotifier } from './INotifier';

export class ConsoleNotifierAdapter implements INotifier {
  async send(message: string): Promise<void> {
    console.log(`[NOTIFICACIÓN] ${message}`);
  }
}