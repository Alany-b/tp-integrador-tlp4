import { INotifier } from './INotifier';
import { INotificationRepository } from './INotificationRepository';
import { ISubscriptionRepository } from '../subscriptions/ISubscriptionRepository';

export class InAppNotifierAdapter implements INotifier {
  constructor(
    private readonly notificationRepo: INotificationRepository,
    private readonly subscriptionRepo: ISubscriptionRepository
  ) {}

  async send(message: string, eventId?: number): Promise<void> {
    if (!eventId) return;
    
    // Buscar los usuarios suscritos al evento
    const subscriptions = await this.subscriptionRepo.findByEvent(eventId);
    
    // Crear una notificación para cada usuario
    for (const sub of subscriptions) {
      await this.notificationRepo.create(sub.userId, message);
    }
  }
}
