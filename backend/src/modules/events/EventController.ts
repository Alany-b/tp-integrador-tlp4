import { Request, Response } from 'express';
import { EventService } from './EventService';

export class EventController {
  constructor(private readonly service: EventService) {}

  getAll = async (_req: Request, res: Response) => {
    const events = await this.service.getAll();
    res.json(events);
  };

  getById = async (req: Request, res: Response) => {
    const event = await this.service.getById(Number(req.params.id));
    res.json(event);
  };

  create = async (req: Request, res: Response) => {
    const { title, description, eventDate } = req.body;
    const created = await this.service.create(title, description, eventDate);
    res.status(201).json(created);
  };

  update = async (req: Request, res: Response) => {
    const { title, description, eventDate } = req.body;
    const updated = await this.service.update(Number(req.params.id), title, description, eventDate);
    res.json(updated);
  };

  changeStatus = async (req: Request, res: Response) => {
    const { status } = req.body;
    const updated = await this.service.changeStatus(Number(req.params.id), status);
    res.json(updated);
  };

  delete = async (req: Request, res: Response) => {
    await this.service.delete(Number(req.params.id));
    res.status(204).send();
  };
}