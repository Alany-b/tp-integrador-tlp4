import { Subscription } from './Subscription';

export interface ISubscriptionRepository {
  create(userId: number, eventId: number): Promise<Subscription>;
  delete(userId: number, eventId: number): Promise<boolean>;
  findByEvent(eventId: number): Promise<Subscription[]>;
  findByUser(userId: number): Promise<Subscription[]>;
}
