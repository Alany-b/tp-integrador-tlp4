import { Subscription } from './Subscription';
import { ISubscriptionRepository } from './ISubscriptionRepository';

export class SubscriptionRepository implements ISubscriptionRepository {
  async create(userId: number, eventId: number): Promise<Subscription> {
    return Subscription.create({ userId, eventId });
  }

  async delete(userId: number, eventId: number): Promise<boolean> {
    const deleted = await Subscription.destroy({ where: { userId, eventId } });
    return deleted > 0;
  }

  async findByEvent(eventId: number): Promise<Subscription[]> {
    return Subscription.findAll({ where: { eventId } });
  }

  async findByUser(userId: number): Promise<Subscription[]> {
    return Subscription.findAll({ where: { userId } });
  }
}
