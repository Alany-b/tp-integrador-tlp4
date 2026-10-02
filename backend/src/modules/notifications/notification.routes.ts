import { Router, RequestHandler } from 'express';
import { NotificationController } from './NotificationController';
import { authorize } from '../../middlewares/authorize';
import { PERMISSIONS } from '../roles/permissions';

export function createNotificationRouter(
  controller: NotificationController,
  authenticate: RequestHandler
): Router {
  const router = Router();

  router.use(authenticate);

  router.get('/', authorize(PERMISSIONS.NOTIFICATION_READ), controller.getAll);
  router.patch('/:id/read', authorize(PERMISSIONS.NOTIFICATION_READ), controller.markAsRead);

  return router;
}
