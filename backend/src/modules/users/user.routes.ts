import { RequestHandler, Router } from 'express';
import { authorize } from '../../middlewares/authorize';
import { PERMISSIONS } from '../roles/permissions';
import { UserController } from './UserController';

export function createUserRouter(controller: UserController, authenticate: RequestHandler): Router {
  const router = Router();
  router.use(authenticate); 
  router.get('/', authorize(PERMISSIONS.USER_READ), controller.list);
  router.patch('/:id/role', authorize(PERMISSIONS.USER_ASSIGN_ROLE), controller.assignRole);
  return router;
}