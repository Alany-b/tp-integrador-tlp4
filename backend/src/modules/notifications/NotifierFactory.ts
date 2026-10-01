import { INotifier } from './INotifier';
import { ConsoleNotifierAdapter } from './ConsoleNotifierAdapter';
import { InAppNotifierAdapter } from './InAppNotifierAdapter';
import { INotificationRepository } from './INotificationRepository';
import { ISubscriptionRepository } from '../subscriptions/ISubscriptionRepository';

export class NotifierFactory {
  constructor(
    private readonly notificationRepo: INotificationRepository,
    private readonly subscriptionRepo: ISubscriptionRepository
  ) {}

  create(type: 'console' | 'inapp'): INotifier {
    if (type === 'console') {
      return new ConsoleNotifierAdapter();
    }

    if (type === 'inapp') {
      return new InAppNotifierAdapter(this.notificationRepo, this.subscriptionRepo);
    }

    throw new Error('Notifier type not supported');
  }
}