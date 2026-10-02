import { Request, Response } from 'express';
import { SubscriptionService } from './SubscriptionService';

export class SubscriptionController {
  constructor(private readonly service: SubscriptionService) {}

  subscribe = async (req: Request, res: Response) => {
    const eventId = Number(req.params.id);
    // userId lo sacamos del token (req.auth)
    const userId = req.auth?.userId;
    if (!userId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    try {
      const sub = await this.service.subscribe(userId, eventId);
      res.status(201).json(sub);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  unsubscribe = async (req: Request, res: Response) => {
    const eventId = Number(req.params.id);
    const userId = req.auth?.userId;
    if (!userId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    try {
      await this.service.unsubscribe(userId, eventId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
