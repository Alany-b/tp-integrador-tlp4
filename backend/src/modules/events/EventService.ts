import { IEventRepository } from './IEventRepository';
import { EventPublisher } from '../../observer/EventPublisher';
import { ValidationError } from '../../middlewares/AppError';

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

  private parseDate(value: unknown): Date {
    const date = new Date(String(value));
    if (value === undefined || value === null || value === '' || Number.isNaN(date.getTime())) {
      throw new ValidationError('La fecha y hora del evento es obligatoria y debe ser válida');
    }
    return date;
  }

  async create(title: string, description: string, eventDate: unknown) {
    return this.eventRepo.create({ title, description, eventDate: this.parseDate(eventDate) });
  }

  async update(id: number, title: string, description: string, eventDate: unknown) {
    const updated = await this.eventRepo.update(id, { title, description, eventDate: this.parseDate(eventDate) });
    if (!updated) throw new Error('Evento no encontrado');
    return updated;
  }

  async changeStatus(id: number, newStatus: string) {
    const validStatuses = ['PROGRAMADO', 'REPROGRAMADO', 'CANCELADO', 'FINALIZADO'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Estado inválido. Los estados permitidos son: ${validStatuses.join(', ')}`);
    }

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