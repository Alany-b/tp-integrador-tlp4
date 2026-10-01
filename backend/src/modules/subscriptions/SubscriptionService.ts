import { ISubscriptionRepository } from './ISubscriptionRepository';
import { IEventRepository } from '../events/IEventRepository';
import { EventPublisher } from '../../observer/EventPublisher';

export class SubscriptionService {
  constructor(
    private readonly repo: ISubscriptionRepository,
    private readonly eventRepo: IEventRepository
  ) {}

  async subscribe(userId: number, eventId: number) {
    const event = await this.eventRepo.findById(eventId);
    if (!event) throw new Error('Evento no encontrado');

    const exists = await this.repo.findByEvent(eventId);
    if (exists.some((s) => s.userId === userId)) {
      throw new Error('Ya estás suscrito a este evento');
    }

    return this.repo.create(userId, eventId);
  }

  async unsubscribe(userId: number, eventId: number) {
    const deleted = await this.repo.delete(userId, eventId);
    if (!deleted) throw new Error('No estabas suscrito a este evento');
  }
}
