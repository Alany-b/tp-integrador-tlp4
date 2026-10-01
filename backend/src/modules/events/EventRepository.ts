import { Event } from './Event';
import { IEventRepository } from './IEventRepository';

export class EventRepository implements IEventRepository {
  async findAll(): Promise<Event[]> {
    return Event.findAll();
  }

  async findById(id: number): Promise<Event | null> {
    return Event.findByPk(id);
  }

  async create(data: { title: string; description: string }): Promise<Event> {
    return Event.create(data);
  }

  async updateStatus(id: number, status: string): Promise<Event | null> {
    const event = await this.findById(id);
    if (!event) return null;
    event.status = status;
    await event.save();
    return event;
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await Event.destroy({ where: { id } });
    return deleted > 0;
  }
}