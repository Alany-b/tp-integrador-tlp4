import { RequestHandler } from 'express';
import { ITokenService } from '../modules/auth/ITokenService';
import { IUserRepository } from '../modules/users/IUserRepository';
import './authContext'; // carga la ampliación del tipo Request
import { UnauthorizedError } from './AppError';

const BEARER_PREFIX = 'Bearer ';

// Fábrica: recibe sus dependencias (interfaces) y devuelve el middleware ya configurado
export function createAuthenticate(tokens: ITokenService, users: IUserRepository): RequestHandler {
  return async (req, _res, next) => {
    try {
      const header = req.headers.authorization; // llega como "Bearer <token>"
      if (header === undefined || !header.startsWith(BEARER_PREFIX)) {
        throw new UnauthorizedError('Falta el token de autenticación');
        
      }
      
      const { userId } = tokens.verify(header.slice(BEARER_PREFIX.length).trim()); 
      


      // Leemos el usuario y sus permisos de la base en cada petición:
      // si un admin le cambia el rol, el cambio rige al instante
      const user = await users.findByIdWithPermissions(userId);
      if (user === null || user.role === undefined) {
        throw new UnauthorizedError('El usuario ya no existe');
      }
      req.auth = {
        userId: user.id,
        role: user.role.name,
        permissions: (user.role.permissions ?? []).map((permission) => permission.name),
      };
      next(); // sigue al siguiente middleware o al controller
    } catch (error) {
      next(error);
    }
  };
}