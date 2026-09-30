import { Router } from 'express';
import { EventController } from './EventController';

export function createEventRouter(controller: EventController): Router {
  const router = Router();

  router.get('/', controller.getAll);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.patch('/:id/status', controller.changeStatus);
  router.delete('/:id', controller.delete);

  return router;
}