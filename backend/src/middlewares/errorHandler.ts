import { NextFunction, Request, Response } from 'express';
import { AppError } from './AppError';

// Express reconoce un middleware de errores por tener EXACTAMENTE 4 parámetros
export function errorHandler(
  err: unknown,        // lo que se haya lanzado con throw (puede ser cualquier cosa)
  _req: Request,       // el guion bajo indica que no lo usamos
  res: Response,
  _next: NextFunction
): void {
  // Error esperado: respondemos con su código y su mensaje
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }
  // Error inesperado: lo registramos en consola y NO exponemos detalles al cliente
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
}