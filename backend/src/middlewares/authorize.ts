import { RequestHandler } from 'express';
import { PermissionName } from '../modules/roles/permissions';
import { ForbiddenError, UnauthorizedError } from './AppError';
import './authContext';

// Uso en una ruta: authorize(PERMISSIONS.EVENT_CREATE)
export function authorize(permission: PermissionName): RequestHandler {
  return (req, _res, next) => {
    if (req.auth === undefined) {
      next(new UnauthorizedError()); // authorize se puso sin authenticate antes
      return;
    }
    if (!req.auth.permissions.includes(permission)) {
      next(new ForbiddenError()); // 403 aunque llamen al endpoint directo con curl o Postman
      return;
    }
    next();
  };
}