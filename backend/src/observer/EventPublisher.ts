import { EventStatusChangedPayload } from './EventStatusChangedPayload';
import { IObserver } from './IObserver';
import { ISubject } from './ISubject';

export class EventPublisher implements ISubject {
  // Lista propia de observers: no usamos EventEmitter, como exige la consigna
  private readonly observers: IObserver[] = [];

  attach(observer: IObserver): void {
    // Evitamos registrar dos veces el mismo observer
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  detach(observer: IObserver): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1); // lo quitamos de la lista
    }
  }

  async notify(payload: EventStatusChangedPayload): Promise<void> {
    // allSettled espera a todos los observers y no se corta si uno falla
    const results = await Promise.allSettled(
      this.observers.map((observer) => observer.update(payload))
    );
    // Un observer roto no debe impedir el cambio de estado ni a los demás: solo lo registramos
    results.forEach((result) => {
      if (result.status === 'rejected') {
        console.error('[Observer] Falló un observador:', result.reason);
      }
    });
  }
}