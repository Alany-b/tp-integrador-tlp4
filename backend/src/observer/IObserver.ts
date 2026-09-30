import { EventStatusChangedPayload } from './EventStatusChangedPayload';

// Contrato de quien quiere enterarse de los cambios
export interface IObserver {
  update(payload: EventStatusChangedPayload): Promise<void>;
}