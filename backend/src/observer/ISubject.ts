import { EventStatusChangedPayload } from './EventStatusChangedPayload';
import { IObserver } from './IObserver';

// Contrato de quien anuncia los cambios
export interface ISubject {
  attach(observer: IObserver): void;                          // suscribir un observer
  detach(observer: IObserver): void;                          // desuscribirlo
  notify(payload: EventStatusChangedPayload): Promise<void>;  // avisar a todos
}