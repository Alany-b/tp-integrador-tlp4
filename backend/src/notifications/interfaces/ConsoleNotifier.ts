import { EventPayload } from "./EventPayload";

export class ConsoleNotifier {
    update(oldStatus: string, newStatus: string) {
        console.log(`[AVISO] cambio de ${oldStatus} a ${newStatus}`);
    }
}