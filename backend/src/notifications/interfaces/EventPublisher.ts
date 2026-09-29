import { ConsoleNotifier } from "./ConsoleNotifier";

export class EventPublisher {
    private observers: ConsoleNotifier[] = [];

    suscribe(observers: ConsoleNotifier) {
        this.observers.push(observers)
    }

    notify(oldStatus: string, newStatus: string) {
        this.observers.forEach(obs => obs.update(oldStatus, newStatus));
    }
}