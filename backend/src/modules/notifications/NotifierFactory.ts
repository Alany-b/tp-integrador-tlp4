import { INotifier } from './INotifier';

export class NotifierFactory {
  create(type: 'console' | 'inapp'): INotifier {
    if (type === 'console') {
      return {
        send: async (message: string) => {
          console.log(message);
        },
      };
    }

    // Canal in-app simple que cumple la interfaz
    return {
      send: async (message: string) => {
        // En una etapa posterior acá se puede persistir la notificación
      },
    };
  }
}