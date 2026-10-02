import { Request, Response } from 'express';
import { INotificationRepository } from './INotificationRepository';

export class NotificationController {
  constructor(private readonly notificationRepo: INotificationRepository) {}

  getAll = async (req: Request, res: Response) => {
    const userId = req.auth?.userId;
    if (!userId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    try {
      const notifications = await this.notificationRepo.findByUser(userId);
      res.json(notifications);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  markAsRead = async (req: Request, res: Response) => {
    try {
      await this.notificationRepo.markAsRead(Number(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
