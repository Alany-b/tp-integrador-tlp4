import { Event } from './Event';

export interface IEventRepository {
  findAll(): Promise<Event[]>;
  findById(id: number): Promise<Event | null>;
  create(data: { title: string; description: string }): Promise<Event>;
  updateStatus(id: number, status: string): Promise<Event | null>;
  delete(id: number): Promise<boolean>;
}