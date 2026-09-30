import { IEventRepository } from './IEventRepository';
import { EventPublisher } from '../../observer/EventPublisher';

export class EventService {
  constructor(
    private readonly eventRepo: IEventRepository,
    private readonly publisher: EventPublisher
  ) {}

  async getAll() {
    return this.eventRepo.findAll();
  }

  async getById(id: number) {
    const event = await this.eventRepo.findById(id);
    if (!event) throw new Error('Evento no encontrado');
    return event;
  }

  async create(title: string, description: string) {
    return this.eventRepo.create({ title, description });
  }

  async changeStatus(id: number, newStatus: string) {
    const oldEvent = await this.getById(id);
    const oldStatus = oldEvent.status;

    const updated = await this.eventRepo.updateStatus(id, newStatus);

    await this.publisher.notify({
      eventId: id,
      eventTitle: oldEvent.title,
      oldStatus,
      newStatus,
    });

    return updated;
  }

  async delete(id: number) {
    return this.eventRepo.delete(id);
  }
}