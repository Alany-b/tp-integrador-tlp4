import { Notification } from './Notification';

export interface INotificationRepository {
  create(userId: number, message: string): Promise<Notification>;
  findByUser(userId: number): Promise<Notification[]>;
  markAsRead(id: number): Promise<void>;
}
