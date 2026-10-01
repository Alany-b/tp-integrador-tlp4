import { Router, RequestHandler } from 'express';
import { EventController } from './EventController';
import { authorize } from '../../middlewares/authorize';
import { PERMISSIONS } from '../roles/permissions';

export function createEventRouter(controller: EventController, authenticate: RequestHandler): Router {
  const router = Router();

  // Protegemos todas las rutas con autenticación
  router.use(authenticate);

  router.get('/', authorize(PERMISSIONS.EVENT_READ), controller.getAll);
  router.get('/:id', authorize(PERMISSIONS.EVENT_READ), controller.getById);
  router.post('/', authorize(PERMISSIONS.EVENT_CREATE), controller.create);
  router.patch('/:id/status', authorize(PERMISSIONS.EVENT_CHANGE_STATUS), controller.changeStatus);
  router.delete('/:id', authorize(PERMISSIONS.EVENT_DELETE), controller.delete);

  return router;
}