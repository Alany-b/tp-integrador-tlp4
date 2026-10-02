import { Event } from './Event';

export interface IEventRepository {
  findAll(): Promise<Event[]>;
  findById(id: number): Promise<Event | null>;
  create(data: { title: string; description: string; eventDate: Date }): Promise<Event>;
  update(id: number, data: { title: string; description: string; eventDate: Date }): Promise<Event | null>;
  updateStatus(id: number, status: string): Promise<Event | null>;
  delete(id: number): Promise<boolean>;
}