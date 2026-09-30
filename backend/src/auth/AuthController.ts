import { NextFunction, Request, Response } from 'express';
import { ValidationError } from '../middlewares/AppError';
import { readEmail, readString } from '../middlewares/validators';
import { AuthService } from './AuthService';

const MIN_PASSWORD_LENGTH = 6;

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Funciones flecha: conservan el `this` cuando Express las llama como callbacks
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body: unknown = req.body;                  // llega sin garantías: lo tratamos como unknown
      const name = readString(body, 'name');
      const email = readEmail(body);
      const password = readString(body, 'password');
      if (password.length < MIN_PASSWORD_LENGTH) {
        throw new ValidationError(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`);
      }
      const result = await this.authService.register({ name, email, password });
      res.status(201).json(result);                    // 201 Created
    } catch (error) {
      next(error);                                     // el errorHandler decide el código HTTP
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body: unknown = req.body;
      const email = readEmail(body);
      const password = readString(body, 'password');
      const result = await this.authService.login({ email, password });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}