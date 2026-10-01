import { Router, RequestHandler } from 'express';
import { EventController } from './EventController';
import { SubscriptionController } from '../subscriptions/SubscriptionController';
import { authorize } from '../../middlewares/authorize';
import { PERMISSIONS } from '../roles/permissions';

export function createEventRouter(
  controller: EventController,
  subscriptionController: SubscriptionController,
  authenticate: RequestHandler
): Router {
  const router = Router();

  // Protegemos todas las rutas con autenticación
  router.use(authenticate);

  router.get('/', authorize(PERMISSIONS.EVENT_READ), controller.getAll);
  router.get('/:id', authorize(PERMISSIONS.EVENT_READ), controller.getById);
  router.post('/', authorize(PERMISSIONS.EVENT_CREATE), controller.create);
  router.put('/:id', authorize(PERMISSIONS.EVENT_UPDATE), controller.update);
  router.patch('/:id/status', authorize(PERMISSIONS.EVENT_CHANGE_STATUS), controller.changeStatus);
  router.delete('/:id', authorize(PERMISSIONS.EVENT_DELETE), controller.delete);

  // Suscripciones (se montan sobre /events/:id/subscription)
  router.post('/:id/subscription', authorize(PERMISSIONS.SUBSCRIPTION_CREATE), subscriptionController.subscribe);
  router.delete('/:id/subscription', authorize(PERMISSIONS.SUBSCRIPTION_DELETE), subscriptionController.unsubscribe);

  return router;
}