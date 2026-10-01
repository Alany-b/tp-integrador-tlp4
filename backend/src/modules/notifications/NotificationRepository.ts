import { Notification } from './Notification';
import { INotificationRepository } from './INotificationRepository';

export class NotificationRepository implements INotificationRepository {
  async create(userId: number, message: string): Promise<Notification> {
    return Notification.create({ userId, message });
  }

  async findByUser(userId: number): Promise<Notification[]> {
    return Notification.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
  }

  async markAsRead(id: number): Promise<void> {
    await Notification.update({ read: true }, { where: { id } });
  }
}
